import InputText, { type InputFilterFn } from "@/components/InputText"
import { memo, useEffect, useRef, useState } from "react"
import type { TextareaProps } from "tdesign-react"

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

/**
 * 可编辑文本单元格：输入用本地 state，失焦（单行还可回车）再写回表格。
 * 聚焦期间不同步外部 value，避免输入被打断。
 */
export const EditableTextCell = memo(function EditableTextCell(props: EditableTextCellProps) {
  const {
    rowId,
    field,
    value = "",
    placeholder = "请输入",
    inputRule,
    decimalPlaces,
    positive,
    textarea = false,
    filterSpace,
    maxlength,
    autosize = { minRows: 1, maxRows: 3 },
    onCommit,
  } = props
  const [inner, setInner] = useState(value)
  const focusedRef = useRef(false)
  const valueRef = useRef(value)
  const onCommitRef = useRef(onCommit)
  valueRef.current = value
  onCommitRef.current = onCommit

  useEffect(() => {
    if (!focusedRef.current) setInner(value)
  }, [value])

  const commit = (next: string) => {
    if (next === valueRef.current) return
    valueRef.current = next
    onCommitRef.current(rowId, { [field]: next })
  }

  if (textarea) {
    return (
      <InputText
        textarea
        placeholder={placeholder}
        filterSpace={filterSpace ?? false}
        inputRule={inputRule}
        maxlength={maxlength}
        autosize={autosize}
        value={inner}
        onFocus={() => {
          focusedRef.current = true
        }}
        onChange={setInner}
        onBlur={(val) => {
          focusedRef.current = false
          const next = val ?? ""
          setInner(next)
          commit(next)
        }}
      />
    )
  }

  return (
    <InputText
      clearable
      placeholder={placeholder}
      inputRule={inputRule}
      decimalPlaces={decimalPlaces}
      positive={positive}
      maxlength={maxlength}
      value={inner}
      onFocus={() => {
        focusedRef.current = true
      }}
      onChange={setInner}
      onEnter={(val) => {
        const next = val ?? ""
        setInner(next)
        commit(next)
      }}
      onBlur={(val) => {
        focusedRef.current = false
        const next = val ?? ""
        setInner(next)
        commit(next)
      }}
    />
  )
})

export default EditableTextCell
