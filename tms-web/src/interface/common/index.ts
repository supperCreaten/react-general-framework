import type { AxiosRequestConfig } from "axios"
import type { TableRowData } from "tdesign-react"

/** 登录成功返回的 accessToken（拦截器解包后多为字符串） */
export type LoginResult = string

/** 刷新令牌返回 */
export type RefreshTokenResult = string

/** 上传接口返回 */
export type UploadResult = {
  url?: string
  fileName?: string
  newFileName?: string
  originalFilename?: string
  [key: string]: unknown
}

/** 敏感字段解密结果 */
export type DecryptSensitiveResult = string

/** 无业务 data 的写操作结果（增删改 / 启停等） */
export type ApiVoid = void

/** 接口响应体：{ code, success, msg, msgId, data } 或直接返回业务数据 */
export type ApiEnvelope<T = unknown> = {
  data?: T
  code?: number
  success?: boolean
  msg?: string
  msgId?: string
}

/**
 * 响应拦截器已 unwrapData，请求方法直接返回业务 data，而不是 AxiosResponse。
 * 默认泛型为 unknown，调用处按需传入业务类型。
 */
export type AppRequest = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  head<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  options<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
}

/** 单字段校验规则 */
export type TableFieldRule<T extends TableRowData> = {
  /** 字段名 */
  field: keyof T & string
  /** 必填；为 string 时作为错误文案 */
  required?: boolean | string
  /** 自定义校验，返回错误文案；返回空表示通过 */
  validator?: (value: unknown, row: T, index: number) => string | undefined | null | false
}

export type ValidateTableRowsOptions<T extends TableRowData> = {
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

export type TableRowFieldError = {
  rowKey: string | number
  rowIndex: number
  field: string
  message: string
}

export type ValidateTableRowsResult = {
  valid: boolean
  errors: TableRowFieldError[]
  /** 按行汇总后的文案，如「第1行：xxx；yyy」 */
  rowMessages: string[]
  firstMessage?: string
}

export type RetryAsyncOptions = {
  /** 总尝试次数，至少为 1 */
  maxAttempts: number
  /** 两次尝试之间的间隔（毫秒） */
  delayMs?: number
  /** 某次失败后（若还会再试）触发 */
  onRetry?: (info: { attempt: number; maxAttempts: number; error: unknown }) => void
}

export interface VisibleDomRect {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

export type DecimalFormatOptions = {
  /** 字段名：在 DISALLOW_ZERO_FIELDS 中则禁止最终为 0 */
  field?: string
  /** 强制禁止最终为 0（正数场景） */
  disallowZero?: boolean
}

export type TaxPriceCalcResult = {
  /** 含税金额（4 位） */
  taxInclusiveAmount: string
  /** 不含税金额（4 位） */
  taxExclusiveAmount: string
  /** 不含税单价（2 位） */
  taxExclusiveUnitPrice: string
  /** 税额（4 位） */
  taxAmount: string
}

/** 可见区域裁剪：舞台尺寸、裁剪框与自然图缩放/旋转参数 */
export type VisibleCropInput = {
  imageSrc: string
  stageWidth: number
  stageHeight: number
  box: { x: number; y: number; size: number }
  naturalWidth: number
  naturalHeight: number
  zoom: number
  rotation: number
}
