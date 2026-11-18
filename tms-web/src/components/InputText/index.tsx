import { formartDecimalPlaces, normalizeDecimalOnBlur } from "@/utils/format/decimal"
import type { InputProps, TextareaProps } from "tdesign-react"
import { Input, Textarea } from "tdesign-react"

/** 输入过滤函数：接收当前值，返回过滤后的值（输入过程中生效） */
export type InputFilterFn = (value: string) => string

type FormatOptions = {
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
}

export type InputTextProps =
  | ({ textarea?: false } & FormatOptions & InputProps)
  | ({ textarea: true; filterSpace?: boolean; inputRule?: InputFilterFn } & TextareaProps)

/** 单行去掉全部空白；多行保留换行，去掉空格/制表等 */
function stripSpace(raw: string, keepNewlines: boolean) {
  return keepNewlines ? raw.replace(/[^\S\n]+/g, "") : raw.replace(/\s+/g, "")
}

function formatInputValue(raw: string, options: FormatOptions) {
  const { filterSpace = true, decimalPlaces, positive, inputRule } = options
  let next = filterSpace ? stripSpace(raw, false) : raw

  if (inputRule) {
    next = inputRule(next)
  } else if (decimalPlaces != null) {
    next = formartDecimalPlaces(next, decimalPlaces, { disallowZero: positive })
  }

  return next
}

/** Input / Textarea 二次封装：默认去空格；可自定义 inputRule，否则按 decimalPlaces 走小数过滤 */
export default function InputText(props: InputTextProps) {
  if (props.textarea) {
    const { textarea: _textarea, filterSpace = true, inputRule, onChange, onBlur, ...rest } = props
    const filter = (raw: string) => {
      let next = filterSpace ? stripSpace(raw, true) : raw
      if (inputRule) next = inputRule(next)
      return next
    }

    return (
      <Textarea
        {...rest}
        onChange={(val, ctx) => {
          onChange?.(filter(val ?? ""), ctx)
        }}
        onBlur={(val, ctx) => {
          const current = val ?? ""
          const next = filter(current)
          if (next !== current) onChange?.(next, undefined)
          onBlur?.(next, ctx)
        }}
      />
    )
  }

  const {
    textarea: _textarea,
    filterSpace = true,
    decimalPlaces,
    positive,
    inputRule,
    onChange,
    onBlur,
    ...rest
  } = props
  const formatOptions = { filterSpace, decimalPlaces, positive, inputRule }

  return (
    <Input
      {...rest}
      onChange={(val, ctx) => {
        onChange?.(formatInputValue(val ?? "", formatOptions), ctx)
      }}
      onBlur={(val, ctx) => {
        const current = val ?? ""
        let next = formatInputValue(current, formatOptions)
        // 未自定义 inputRule、且启用了小数位时，失焦再规范化尾零
        if (!inputRule && decimalPlaces != null) {
          next = normalizeDecimalOnBlur(next, { disallowZero: positive })
        }
        if (next !== current) onChange?.(next, undefined)
        onBlur?.(next, ctx)
      }}
    />
  )
}
