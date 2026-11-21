import type { FormConfig } from "@/interface/form"
import type { UseTableQueryOptions, UseTableQueryReturn } from "@/interface/hooks"
import type { CSSProperties, ReactNode } from "react"
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

/** BasicTable 命令式句柄（供父组件调用 refresh / 本地改数 / 树表懒加载） */
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

export type BasicTableProps<T extends TableRowData> = {
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

export type SearchBoxRef = FormInstanceFunctions

export type SearchBoxProps = {
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

export type ImportCommitResult = {
  totalCount?: number
  successCount?: number
  failCount?: number
  message?: string
  errorFileName?: string
  errorFileBase64?: string
}

export type ImportDialogProps = {
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

export type MoreActionItem = {
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

export type MoreActionsProps = {
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

/** 输入过滤函数：接收当前值，返回过滤后的值（输入过程中生效） */
export type InputFilterFn = (value: string) => string

export type InputTextProps =
  | ({
      textarea?: false
      /** 输入时去空格，默认 true */
      filterSpace?: boolean
      /**
       * 小数位数。未传 `inputRule` 时默认走 formartDecimalPlaces；
       * 传了 `inputRule` 则不再套用小数位过滤。
       */
      decimalPlaces?: number
      /** 配合 formartDecimalPlaces：仅正数 */
      positive?: boolean
      /**
       * 自定义输入过滤。传入后优先使用；
       * 不传且设置了 decimalPlaces 时，默认使用 formartDecimalPlaces。
       */
      inputRule?: InputFilterFn
    } & InputProps)
  | ({ textarea: true; filterSpace?: boolean; inputRule?: InputFilterFn } & TextareaProps)

export type EditableTextCommitFn = (rowId: string | number, patch: Record<string, string>) => void

export type EditableTextCellProps = {
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

export type AreaCascaderProps = Omit<CascaderProps, "options"> & {
  /** 自定义选项；默认省市区三级（行政区划编码） */
  options?: CascaderProps["options"]
}

export type PasswordStrengthProps = {
  password?: string
  className?: string
}

export type ContentSectionProps = {
  children?: ReactNode
  /** 内容区是否使用 Card 包裹，默认 true */
  isContentFullCard?: boolean
  /**
   * 是否铺满父容器高度。
   * true：h-full，内容区可滚动；
   * false：高度随内容撑开（便于展示底部 padding）。
   */
  isFull?: boolean
  /** 整块内容 loading 遮罩 */
  loading?: boolean
  className?: string
}

export type TableSectionProps = {
  isContentFullCard?: boolean
  children: ReactNode
  className?: string
}

export type FormSectionBlockProps = {
  title: string
  children?: ReactNode
  variant?: string
  className?: string
}

export type LayoutTitleProps = {
  title: string
  children?: ReactNode
  /** 是否显示展开/收起，默认 true */
  collapsible?: boolean
  /** 非受控：默认是否收起 */
  defaultCollapsed?: boolean
  /** 受控：是否收起 */
  collapsed?: boolean
  /** body区域是否需要 padding */
  isbodyPPadding?: "vertical" | "horizontal" | "all" | "none"
  /** 是否需要 border */
  bordered?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** 标题后操作区（紧跟标题，适合放新增等按钮） */
  actions?: ReactNode
  /** 标题栏右侧额外内容（展开/收起左侧） */
  extra?: ReactNode
  className?: string
  contentClassName?: string
}

export type BasicContentProps = {
  style?: CSSProperties
  className?: string
  children: ReactNode
}