import type { PaginationProps, TableRowData } from "tdesign-react"

/** 远程分页列表统一结构；total 约定为 number（非分页也需回传 total，一般为 rows.length） */
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
  /** 按索引局部更新一行（仅本地） */
  updateRow: (index: number, patch: Partial<T>) => void
  /** 按行主键局部更新（仅本地；虚拟滚动场景优先用这个） */
  updateRowByKey: (key: string | number, patch: Partial<T>, keyField?: string) => void
  /** 按索引删除一行（仅本地） */
  removeRow: (index: number) => void
  /** 按行主键删除（仅本地） */
  removeRowByKey: (key: string | number, keyField?: string) => void
  /** 即时读取当前表格数据（浅拷贝，避免外部直接改内部 state） */
  getDataSource: () => T[]
}
