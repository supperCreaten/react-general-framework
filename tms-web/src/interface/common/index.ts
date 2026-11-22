import type { AxiosRequestConfig } from "axios"
import type { PaginationProps, TableRowData } from "tdesign-react"

/** 接口响应体：{ code, success, msg, msgId, data } 或直接返回业务数据 */
export interface ApiEnvelope<T = unknown> {
  data?: T
  code?: number
  success?: boolean
  msg?: string
  msgId?: string
}

/** 远程列表统一结构；total 约定为 number（非分页也需回传 total，一般为 rows.length） */
export interface TablePageResult<T> {
  total: number
  rows: T[]
}

/** 本地加行插入位置 */
export type AddRowPosition = "start" | "end"

/** refresh 可选参数 */
export interface RefreshOptions {
  /** 是否回到第 1 页再刷新，默认 false */
  resetCurrent?: boolean
}

/** useTableQuery 入参 */
export interface UseTableQueryOptions<T extends TableRowData> {
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

/** 单字段校验规则 */
export interface TableFieldRule<T extends TableRowData> {
  /** 字段名 */
  field: keyof T & string
  /** 必填；为 string 时作为错误文案 */
  required?: boolean | string
  /** 自定义校验，返回错误文案；返回空表示通过 */
  validator?: (value: unknown, row: T, index: number) => string | undefined | null | false
}

export interface ValidateTableRowsOptions<T extends TableRowData> {
  rows: T[]
  rules: TableFieldRule<T>[]
  /** 行主键字段，默认 id */
  rowKey?: string
  /** 最少行数，默认不限制 */
  minRows?: number
  /** 行数不足时的提示 */
  minRowsMessage?: string
  /**
   * 校验失败时是否弹出通知，默认 true。
   * 样式：标题「校验未通过」，正文按行汇总。
   */
  notify?: boolean
  /** 通知标题，默认「校验未通过」 */
  notifyTitle?: string
  /** 通知展示时长（ms），默认 4500；传 0 则需手动关闭 */
  notifyDuration?: number
}

export interface TableRowFieldError {
  rowKey: string | number
  rowIndex: number
  field: string
  message: string
}

export interface ValidateTableRowsResult {
  valid: boolean
  errors: TableRowFieldError[]
  /** 按行汇总后的文案，如「第1行：xxx；yyy」 */
  rowMessages: string[]
  firstMessage?: string
}

/**
 * 响应拦截器已 unwrapData，请求方法直接返回业务 data，而不是 AxiosResponse。
 * 默认泛型为 unknown，调用处按需传入业务类型。
 */
export interface AppRequest {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  head<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  options<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
}

/** 登录用户信息（兼容若依 { permissions, roles, user } 与扁平结构） */
export type UserInfoRes = {
  permissions?: string[]
  roles?: string[]
  user?: Record<string, unknown>
} & Record<string, unknown>

/** 上传结果 */
export interface UploadResult {
  url?: string
}

/** 小数格式化选项 */
export interface DecimalFormatOptions {
  /** 字段名：在 DISALLOW_ZERO_FIELDS 中则禁止最终为 0 */
  field?: string
  /** 强制禁止最终为 0（正数场景） */
  disallowZero?: boolean
}

/** 异步重试选项 */
export interface RetryAsyncOptions {
  /** 总尝试次数，至少为 1 */
  maxAttempts: number
  /** 两次尝试之间的间隔（毫秒） */
  delayMs?: number
  /** 某次失败后（若还会再试）触发 */
  onRetry?: (info: { attempt: number; maxAttempts: number; error: unknown }) => void
}

/** 元素可视矩形 */
export interface VisibleDomRect {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

/** 字典下拉选项 */
export interface DictOption {
  label: string
  value: string
  id: string
}

/** useTableQuery 返回值 */
export interface UseTableQueryReturn<T extends TableRowData> {
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
