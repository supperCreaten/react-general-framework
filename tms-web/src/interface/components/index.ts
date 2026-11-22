import type { FormConfig } from "@/interface/form"
import type { PasswordStrengthLevel } from "@/interface/login"
import type {
  UseTableQueryOptions,
  UseTableQueryReturn,
} from "@/interface/common"
import type { ReactNode } from "react"
import type {
  ButtonProps,
  CascaderProps,
  DialogProps,
  DropdownProps,
  EnhancedTableProps,
  EnhancedTableRef,
  FormInstanceFunctions,
  FormProps,
  InputProps,
  TableRowData,
  TextareaProps,
} from "tdesign-react"

/** BasicTable 命令式句柄 */
export type BasicTableRef<T extends TableRowData> = Pick<
  UseTableQueryReturn<T>,
  | "refresh"
  | "setTableData"
  | "addRow"
  | "addRows"
  | "updateRow"
  | "updateRowByKey"
  | "removeRow"
  | "removeRowByKey"
  | "getDataSource"
> & {
  /** 底层 EnhancedTable 实例（树表 appendTo / setData 等） */
  getTable: () => EnhancedTableRef | null
}

export interface BasicTableProps<T extends TableRowData> {
  columns: EnhancedTableProps<T>["columns"]
  rowKey?: string
  /** 远程请求；不传则为本地模式 */
  request?: UseTableQueryOptions<T>["request"]
  /** 查询条件；对象变化会重查，函数则每次请求时取值 */
  searchParams?: UseTableQueryOptions<T>["searchParams"]
  /** 挂载后是否自动请求，默认 true（仅远程） */
  autoRequest?: boolean
  /** 是否分页，默认 true；菜单树表等传 false */
  showPagination?: boolean
  /**
   * 表格高度。可编辑虚拟列表等场景请传固定值或配合 maxHeight；
   * 默认 "100%"（撑满 BasicTable 容器）。
   */
  height?: EnhancedTableProps<T>["height"]
  /** 透传给 TDesign EnhancedTable（支持 tree / scroll 虚拟滚动等） */
  tableProps?: Omit<
    EnhancedTableProps<T>,
    "columns" | "data" | "pagination" | "cellEmptyContent" | "rowKey" | "loading" | "loadingProps"
  >
}

export type SearchBoxRef = FormInstanceFunctions

export interface SearchBoxProps {
  formConfig: FormConfig[]
  onSearch: () => void | Promise<void>
  /** 重置后、查询前钩子（如清除树选中） */
  onReset?: () => void
  formProps?: Omit<FormProps, "children" | "form" | "onSubmit" | "onReset">
  extra?: ReactNode
  collapsedVisibleCount?: number
  fieldsPerRow?: number
  searchButtonText?: string
}

export type BasicFormProps = FormProps & {
  formConfig: FormConfig[]
  /** 渲染在字段区右侧，与字段同一行（如搜索操作按钮） */
  extra?: ReactNode
  extraClassName?: string
  /**
   * Row 间距。弹窗表单建议 [16, 0]，由表单项自身预留下方错误区；
   * 搜索区常用 [16, 12]。
   */
  gutter?: [number, number]
  /**
   * 是否预留下方错误/提示高度（类似 Element FormItem），默认 true。
   * 搜索栏等紧凑布局请传 false。
   */
  reserveErrorSpace?: boolean
}

export type BasicDialogProps = Omit<DialogProps, "onConfirm"> & {
  /** 异步确认；传入后由组件管理 loading（可用 confirmLoading 覆盖展示） */
  onSubmit?: () => void | Promise<void>
  onConfirm?: DialogProps["onConfirm"]
  confirmText?: string
  cancelText?: string
}

export interface ImportCommitResult {
  totalCount?: number
  successCount?: number
  failCount?: number
  message?: string
  errorFileName?: string
  errorFileBase64?: string
}

export interface ImportDialogProps {
  visible: boolean
  title?: string
  /** 模板下载文件名 */
  templateFileName: string
  onClose: (imported?: boolean) => void
  /** 下载导入模板 */
  downloadTemplate: () => Promise<Blob>
  /** 提交导入（FormData 含 file、partialCommit） */
  importFile: (formData: FormData) => Promise<ImportCommitResult>
}

export type EditableTextCommitFn = (rowId: string | number, patch: Record<string, string>) => void

/** 输入过滤函数：接收当前值，返回过滤后的值（输入过程中生效） */
export type InputFilterFn = (value: string) => string

export interface EditableTextCellProps {
  rowId: string | number
  field: string
  value?: string
  placeholder?: string
  inputRule?: InputFilterFn
  decimalPlaces?: number
  positive?: boolean
  /** 多行文本；开启后回车换行，仅失焦写回 */
  textarea?: boolean
  /** 多行时是否过滤空格，默认 false（保留名称中的空格） */
  filterSpace?: boolean
  maxlength?: number
  autosize?: TextareaProps["autosize"]
  onCommit: EditableTextCommitFn
}

export interface MoreActionItem {
  key: string | number
  label: ReactNode
  disabled?: boolean
  divider?: boolean
  /** 下拉项主题；danger 会映射为 error */
  theme?: "default" | "success" | "warning" | "error" | "danger"
  prefixIcon?: ReactNode
  /** 为 false 时不渲染 */
  visible?: boolean
  onClick?: () => void
}

export interface MoreActionsProps {
  /** 操作项 */
  items: MoreActionItem[]
  /**
   * 直接展示的按钮数量，超出部分收入「更多」
   * - 默认 1：外侧保留 1 个文字按钮
   * - 传 0：全部收入「更多」
   * - 传 N：前 N 个为文字按钮，其余进「更多」
   */
  maxVisible?: number
  moreText?: string
  /** 「更多」触发按钮样式（默认 primary text，贴合表格操作列） */
  moreButtonProps?: Omit<ButtonProps, "children" | "suffix" | "onClick">
  /** 外侧直接展示的文字按钮样式 */
  actionButtonProps?: Omit<ButtonProps, "children" | "onClick" | "theme" | "disabled">
  className?: string
  dropdownProps?: Omit<DropdownProps, "options" | "onClick" | "children">
}

export type AreaCascaderProps = Omit<CascaderProps, "options"> & {
  /** 自定义选项；默认省市区三级（行政区划编码） */
  options?: CascaderProps["options"]
}

export type InputTextProps =
  | ({
      textarea?: false
      filterSpace?: boolean
      decimalPlaces?: number
      positive?: boolean
      inputRule?: InputFilterFn
    } & InputProps)
  | ({ textarea: true; filterSpace?: boolean; inputRule?: InputFilterFn } & TextareaProps)

export interface PasswordStrengthProps {
  password?: string
  className?: string
  /** 可选：外部已计算的强度等级 */
  level?: PasswordStrengthLevel
}

export interface TableSectionProps {
  isContentFullCard?: boolean
  children: ReactNode
  className?: string
}
