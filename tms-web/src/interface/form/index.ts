import type { ReactNode } from "react"
import type { ColProps, FormItemProps } from "tdesign-react"
import type {
  FormListField,
  FormListFieldOperation,
  NamePath,
  TdFormListProps,
} from "tdesign-react/es/form/type"

/** 动态字段行元信息（对应 TDesign FormListField） */
export type FormFieldListRow = FormListField
/** 动态字段增删操作（对应 TDesign FormListFieldOperation） */
export type FormFieldListOperation = FormListFieldOperation

/** 动态字段每一行内的子字段配置（name 相对当前行） */
export interface FormFieldListItemConfig extends Omit<FormItemProps, "name" | "children"> {
  name: string | number
  colProps?: ColProps
  component:
    | ReactNode
    | ((ctx: {
        row: FormFieldListRow
        index: number
        operation: FormFieldListOperation
      }) => ReactNode)
  /** 为 true 时不包裹 FormItem，直接渲染 component */
  bare?: boolean
}

/** 动态增减字段配置，挂到 FormConfig.fieldList 上即可 */
export interface FormFieldListConfig {
  /** 字段名，默认取外层 FormConfig.name */
  name?: NamePath
  initialData?: TdFormListProps["initialData"]
  rules?: TdFormListProps["rules"]
  /** 每一行的子字段；与 renderRow 二选一，renderRow 优先 */
  rowFields?: FormFieldListItemConfig[]
  /** 行容器额外 className 等 */
  rowColProps?: ColProps
  showAdd?: boolean
  addText?: string
  /** 点击新增时写入的默认值 */
  defaultRow?: Record<string, unknown> | (() => Record<string, unknown>)
  showRemove?: boolean
  removeText?: string
  /** 最少条数，达到后隐藏删除 */
  min?: number
  /** 最多条数，达到后隐藏新增 */
  max?: number
  /** 完全自定义每一行 */
  renderRow?: (
    row: FormFieldListRow,
    operation: FormFieldListOperation,
    index: number,
  ) => ReactNode
  /** 自定义底部操作区（覆盖默认新增按钮） */
  renderFooter?: (rows: FormFieldListRow[], operation: FormFieldListOperation) => ReactNode
}

export interface FormConfig extends Omit<FormItemProps, "children"> {
  colProps?: ColProps
  /** 普通字段组件；配置 fieldList 时可省略 */
  component?: ReactNode
  /** 为 true 时不包裹 FormItem，直接渲染 component */
  bare?: boolean
  /** 配置后渲染可动态增减的字段组 */
  fieldList?: FormFieldListConfig
}
