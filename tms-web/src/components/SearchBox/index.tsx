import { forwardRef, useImperativeHandle, useState } from "react"
import {
  Button,
  Form,
  Space,
  type FormProps,
  type SubmitContext,
} from "tdesign-react"
import { ChevronDownIcon, ChevronUpIcon, RefreshIcon, SearchIcon } from "tdesign-icons-react"
import BasicForm from "@/components/BasicForm"
import type { FormConfig } from "@/interface"
import { cn } from "@/utils/methods"
import { DEFAULT_COLLAPSED_VISIBLE, DEFAULT_FIELDS_PER_ROW } from "./constants"

import type { SearchBoxProps, SearchBoxRef } from "@/interface/components"

export type { SearchBoxProps, SearchBoxRef }

async function withLoading(setLoading: (v: boolean) => void, task: () => void | Promise<void>) {
  setLoading(true)
  try {
    await task()
  } finally {
    setLoading(false)
  }
}

const SearchBox = forwardRef<SearchBoxRef, SearchBoxProps>(function SearchBox(
  {
    formConfig,
    formProps,
    onSearch,
    onReset,
    extra,
    collapsedVisibleCount = DEFAULT_COLLAPSED_VISIBLE,
    fieldsPerRow = DEFAULT_FIELDS_PER_ROW,
    searchButtonText = "查询",
  },
  ref,
) {
  const [form] = Form.useForm()
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  useImperativeHandle(ref, () => form, [form])

  const expandable = formConfig.length > collapsedVisibleCount
  const collapsedLayout = !expandable || collapsed
  /** TDesign Row/Col 为 12 栅格 */
  const span = Math.max(1, Math.floor(12 / Math.max(1, fieldsPerRow)))

  const { className, labelWidth = 80, labelAlign = "right", ...restFormProps } = formProps ?? {}

  const searchFormConfig: FormConfig[] = formConfig.map((item, index) => ({
    ...item,
    colProps: {
      span,
      ...item.colProps,
      className: cn(
        item.colProps?.className,
        collapsedLayout && index >= collapsedVisibleCount && "hidden",
      ),
    },
  }))

  const toolbar = (
    <Space size={8} breakLine={false}>
      {expandable ? (
        <Button
          theme="primary"
          variant="text"
          disabled={loading}
          suffix={collapsedLayout ? <ChevronDownIcon /> : <ChevronUpIcon />}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsedLayout ? "展开" : "收起"}
        </Button>
      ) : null}
      <Button theme="primary" type="submit" icon={<SearchIcon />} loading={loading}>
        {searchButtonText}
      </Button>
      <Button
        variant="outline"
        icon={<RefreshIcon />}
        loading={loading}
        onClick={() =>
          void withLoading(setLoading, async () => {
            form.reset()
            onReset?.()
            await onSearch()
          })
        }
      >
        重置
      </Button>
      {extra}
    </Space>
  )

  return (
    <BasicForm
      form={form}
      formConfig={searchFormConfig}
      extra={toolbar}
      gutter={[16, 12]}
      reserveErrorSpace={false}
      labelWidth={labelWidth}
      labelAlign={labelAlign}
      className={cn("w-full", className)}
      onSubmit={async (ctx: SubmitContext) => {
        if (ctx.validateResult !== true) return
        await withLoading(setLoading, onSearch)
      }}
      {...restFormProps}
    />
  )
})

export default SearchBox
export { DEFAULT_COLLAPSED_VISIBLE, DEFAULT_FIELDS_PER_ROW } from "./constants"
