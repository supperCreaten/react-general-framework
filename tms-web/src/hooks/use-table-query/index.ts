import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type {
  AddRowPosition,
  RefreshOptions,
  TablePageResult,
  UseTableQueryOptions,
  UseTableQueryReturn,
} from "@/interface/hooks"
import type { PageInfo, TableRowData } from "tdesign-react"

export type {
  AddRowPosition,
  RefreshOptions,
  TablePageResult,
  UseTableQueryOptions,
  UseTableQueryReturn,
} from "@/interface/hooks"

/**
 * 表格数据与分页。
 * - 远程：传 `request`；对象型 `searchParams` 变化会重置页码并重查；函数型在每次请求时取值。
 * - 本地：用 `setTableData` / `addRow` / `addRows` / `updateRow(ByKey)` / `removeRow(ByKey)`。
 */
export default function useTableQuery<T extends TableRowData>(
  options: UseTableQueryOptions<T> = {},
): UseTableQueryReturn<T> {
  const {
    request,
    defaultCurrent = 1,
    defaultPageSize = 10,
    autoRequest = true,
    enablePagination = true,
    searchParams,
  } = options

  const isRemote = typeof request === "function"
  const isSearchParamsGetter = typeof searchParams === "function"

  const [current, setCurrent] = useState(defaultCurrent)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState<T[]>([])

  const currentRef = useRef(current)
  const pageSizeRef = useRef(pageSize)
  const searchParamsRef = useRef(searchParams)
  const requestRef = useRef(request)
  const dataSourceRef = useRef(dataSource)
  /** 递增作废旧请求（含卸载），只采纳最新结果 */
  const fetchIdRef = useRef(0)
  /** 跳过 searchParams 首次 effect，避免与 autoRequest 重复请求 */
  const isFirstSearchParamsEffectRef = useRef(true)

  currentRef.current = current
  pageSizeRef.current = pageSize
  searchParamsRef.current = searchParams
  requestRef.current = request
  dataSourceRef.current = dataSource

  // 卸载时作废进行中的请求
  useEffect(
    () => () => {
      fetchIdRef.current += 1
    },
    [],
  )

  const resolveSearchParams = useCallback(() => {
    const params = searchParamsRef.current
    return typeof params === "function" ? (params() ?? {}) : (params ?? {})
  }, [])

  /**
   * 发起远程分页请求。
   * 通过 fetchId 丢弃过期响应，避免快速翻页时旧数据覆盖新数据。
   */
  const fetchData = useCallback(
    async (nextCurrent?: number, nextPageSize?: number) => {
      const fetchRequest = requestRef.current
      if (typeof fetchRequest !== "function") return

      const fetchId = ++fetchIdRef.current
      /** 当前请求是否仍是最新一次 */
      const isLatest = () => fetchId === fetchIdRef.current

      setLoading(true)
      try {
        const page = nextCurrent ?? currentRef.current
        const size = nextPageSize ?? pageSizeRef.current
        const data = await fetchRequest({
          ...(enablePagination
            ? {
                current: page,
                currentPage: page,
                pageNum: page,
                pageSize: size,
              }
            : {}),
          ...resolveSearchParams(),
        })
        if (!isLatest()) return
        const rows = data?.rows || []
        setDataSource(rows)
        setTotal(Number(data.total) || 0)
      } finally {
        if (isLatest()) setLoading(false)
      }
    },
    [enablePagination, resolveSearchParams],
  )

  /** 页码重置为第 1 页（同步更新 state 与 ref） */
  const goFirstPage = useCallback(() => {
    setCurrent(1)
    currentRef.current = 1
  }, [])

  /**
   * 刷新远程列表。
   * @param opts.resetCurrent 为 true 时先回到第 1 页再请求（常用于筛选后）
   */
  const refresh = useCallback(
    async (opts?: RefreshOptions) => {
      if (typeof requestRef.current !== "function") return
      if (opts?.resetCurrent) {
        goFirstPage()
        await fetchData(1, pageSizeRef.current)
        return
      }
      await fetchData()
    },
    [fetchData, goFirstPage],
  )

  /** TDesign 分页 onChange：更新页码并拉取对应页数据 */
  const onPageChange = useCallback(
    (pageInfo: PageInfo) => {
      setCurrent(pageInfo.current)
      setPageSize(pageInfo.pageSize)
      void fetchData(pageInfo.current, pageInfo.pageSize)
    },
    [fetchData],
  )

  /** 本地更新 dataSource，并同步 total（勿在 setState updater 内再调 setState） */
  const patchLocalData = useCallback(
    (updater: (prev: T[]) => T[]) => {
      if (isRemote) return
      const next = updater(dataSourceRef.current)
      dataSourceRef.current = next
      setDataSource(next)
      setTotal(next.length)
    },
    [isRemote],
  )

  /** 覆盖本地全量数据（仅本地模式） */
  const setTableData = useCallback(
    (data: T[] | ((prev: T[]) => T[])) => {
      patchLocalData((prev) => (typeof data === "function" ? data(prev) : data))
    },
    [patchLocalData],
  )

  /** 批量追加行（仅本地模式） */
  const addRows = useCallback(
    (newRows: T[], position: AddRowPosition = "start") => {
      if (!newRows.length) return
      patchLocalData((prev) => (position === "start" ? [...newRows, ...prev] : [...prev, ...newRows]))
    },
    [patchLocalData],
  )

  /** 追加一行（仅本地模式） */
  const addRow = useCallback((row: T, position?: AddRowPosition) => addRows([row], position), [addRows])

  /** 按索引局部更新一行（仅本地模式） */
  const updateRow = useCallback(
    (index: number, patch: Partial<T>) => {
      if (index < 0) return
      patchLocalData((prev) => {
        if (index >= prev.length) return prev
        return prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
      })
    },
    [patchLocalData],
  )

  /** 按行主键局部更新（仅本地模式） */
  const updateRowByKey = useCallback(
    (key: string | number, patch: Partial<T>, keyField = "id") => {
      patchLocalData((prev) => {
        let changed = false
        const next = prev.map((item) => {
          if ((item as Record<string, unknown>)[keyField] !== key) return item
          changed = true
          return { ...item, ...patch }
        })
        return changed ? next : prev
      })
    },
    [patchLocalData],
  )

  /** 按索引删除一行（仅本地模式） */
  const removeRow = useCallback(
    (index: number) => {
      if (index < 0) return
      patchLocalData((prev) => {
        if (index >= prev.length) return prev
        return prev.filter((_, i) => i !== index)
      })
    },
    [patchLocalData],
  )

  /** 按行主键删除（仅本地模式） */
  const removeRowByKey = useCallback(
    (key: string | number, keyField = "id") => {
      patchLocalData((prev) => {
        const next = prev.filter((item) => (item as Record<string, unknown>)[keyField] !== key)
        return next.length === prev.length ? prev : next
      })
    },
    [patchLocalData],
  )

  /** 命令式读取当前 dataSource（走 ref，避免闭包过期） */
  const getDataSource = useCallback(() => dataSourceRef.current.slice(), [])

  // 远程：函数型只做首次请求；对象型继续监听变化并重查
  const searchParamsKey = useMemo(
    () => (isSearchParamsGetter ? "" : JSON.stringify(searchParams ?? {})),
    [isSearchParamsGetter, searchParams],
  )
  useEffect(() => {
    if (!isRemote) return

    if (isSearchParamsGetter) {
      if (autoRequest) fetchData(defaultCurrent, defaultPageSize)
      return
    }

    if (isFirstSearchParamsEffectRef.current) {
      isFirstSearchParamsEffectRef.current = false
      if (autoRequest) fetchData(defaultCurrent, defaultPageSize)
      return
    }

    goFirstPage()
    fetchData(1, pageSizeRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsKey])

  /** 组装 TDesign Table 所需的 pagination（本地模式 / 关闭分页时不展示） */
  const pagination = useMemo<PaginationProps | undefined>(
    () =>
      isRemote && enablePagination ? { current, pageSize, total, showJumper: true, onChange: onPageChange } : undefined,
    [isRemote, enablePagination, current, pageSize, total, onPageChange],
  )

  return {
    dataSource,
    loading,
    total,
    current,
    pageSize,
    pagination,
    refresh,
    setTableData,
    addRow,
    addRows,
    updateRow,
    updateRowByKey,
    removeRow,
    removeRowByKey,
    getDataSource,
  }
}
