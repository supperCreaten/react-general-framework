import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { PageInfo, PaginationProps, TableRowData } from "tdesign-react"

/** 远程列表统一结构；total 约定为 number（非分页也需回传 total，一般为 rows.length） */
export type TablePageResult<T> = {
  total: number
  rows: T[]
}

/** 本地加行插入位置 */
export type AddRowPosition = "start" | "end"

/** refresh 可选参数 */
export type RefreshOptions = {
  /** 是否回到第 1 页再刷新，默认 false */
  resetCurrent?: boolean
}

export type UseTableQueryOptions<T extends TableRowData> = {
  /** 远程请求；不传则为本地模式（setTableData / addRow） */
  request?: (params: Record<string, unknown>) => Promise<TablePageResult<T>>
  /** 初始页码，默认 1 */
  defaultCurrent?: number
  /** 初始每页条数，默认 10 */
  defaultPageSize?: number
  /** 挂载后是否自动请求，默认 true（仅远程） */
  autoRequest?: boolean
  /** 是否展示并启用分页，默认 true；树表等场景可关 */
  enablePagination?: boolean
  /**
   * 查询条件。
   * - 传对象：引用变化时自动回到第 1 页并重查
   * - 传函数：每次请求时即时取值（适合 SearchBox.getFieldsValue）
   */
  searchParams?: Record<string, unknown> | (() => Record<string, unknown>)
}

export type UseTableQueryReturn<T extends TableRowData> = {
  /** 表格当前展示的数据 */
  dataSource: T[]
  /** 远程请求 loading */
  loading: boolean
  /** 总条数 */
  total: number
  /** 当前页码（对齐 TDesign pagination.current） */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 可直传 TDesign Table；本地模式为 undefined */
  pagination: PaginationProps | undefined
  /** 刷新远程数据；`resetCurrent: true` 从第 1 页开始 */
  refresh: (options?: RefreshOptions) => Promise<void>
  /** 覆盖本地数据（仅本地） */
  setTableData: (data: T[] | ((prev: T[]) => T[])) => void
  /** 追加一行（仅本地） */
  addRow: (row: T, position?: AddRowPosition) => void
  /** 批量追加（仅本地） */
  addRows: (rows: T[], position?: AddRowPosition) => void
}

/**
 * 表格数据与分页。
 * - 远程：传 `request`；对象型 `searchParams` 变化会重置页码并重查；函数型在每次请求时取值。
 * - 本地：用 `setTableData` / `addRow` / `addRows`。
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
  }
}
