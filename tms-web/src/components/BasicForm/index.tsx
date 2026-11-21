import type {
  FormConfig,
  FormFieldListConfig,
  FormFieldListItemConfig,
  FormFieldListOperation,
  FormFieldListRow,
} from "@/interface"
import type { BasicFormProps } from "@/interface/components"
import type { ColProps } from "tdesign-react"
import { Button, Col, Form, Row } from "tdesign-react"
import type { Key, ReactNode } from "react"
import { clsx } from "clsx"
import "./index.css"

const { FormItem, FormList: FieldList } = Form

/** TDesign 12 栅格默认列宽：xl≥1400 一行 3，md≥992 一行 2，更小屏一行 1 */
export const DEFAULT_FORM_COL: ColProps = { xl: 4, md: 6, sm: 12, xs: 12 }

function toReactKey(name: FormConfig["name"], index: number): Key {
  if (name == null) return index
  if (Array.isArray(name)) return name.map(String).join(".")
  return name
}

function resolveDefaultRow(fieldList: FormFieldListConfig) {
  const { defaultRow } = fieldList
  if (typeof defaultRow === "function") return defaultRow()
  return defaultRow
}

function renderFieldListItem(
  item: FormFieldListItemConfig,
  row: FormFieldListRow,
  index: number,
  operation: FormFieldListOperation,
) {
  const { key: _key, name, ...restRow } = row
  const { colProps, component, bare, name: itemName, ...formItemProps } = item
  const content = typeof component === "function" ? component({ row, index, operation }) : component

  return (
    <Col
      {...(colProps ?? DEFAULT_FORM_COL)}
      key={String(itemName)}
      className={clsx("basic-form__col", colProps?.className)}
    >
      {bare ? (
        content
      ) : (
        <FormItem {...restRow} {...formItemProps} name={[name, itemName]}>
          {content}
        </FormItem>
      )}
    </Col>
  )
}

function renderFieldList(config: FormConfig) {
  const fieldList = config.fieldList
  if (!fieldList) return null
  const {
    rowFields = [],
    rowColProps,
    showAdd = true,
    addText = "新增一行",
    showRemove = true,
    removeText = "删除",
    min = 0,
    max,
    renderRow,
    renderFooter,
  } = fieldList

  const fieldListName = fieldList.name ?? config.name
  const { className: rowClassName } = rowColProps ?? {}

  return (
    <div className="w-full">
      {config.label ? (
        <div className="mb-2.5 text-sm font-semibold leading-5.5 text-(--td-text-color-primary,#152433)">
          {config.label}
        </div>
      ) : null}
      <FieldList name={fieldListName} initialData={fieldList.initialData} rules={fieldList.rules}>
        {(rows, operation) => {
          const canAdd = showAdd && (max == null || rows.length < max)
          const canRemove = showRemove && rows.length > min

          return (
            <>
              {rows.map((row, index) => {
                if (renderRow) {
                  return (
                    <div key={row.key} className={clsx("mb-2", rowClassName)}>
                      {renderRow(row, operation, index)}
                    </div>
                  )
                }

                return (
                  <Row key={row.key} gutter={[16, 0]} align="middle" className={clsx("mb-2", rowClassName)}>
                    {rowFields.map((item) => renderFieldListItem(item, row, index, operation))}
                    {canRemove ? (
                      <Col span={4} className="flex items-center pb-5.5">
                        <Button theme="danger" variant="text" onClick={() => operation.remove(row.name)}>
                          {removeText}
                        </Button>
                      </Col>
                    ) : null}
                  </Row>
                )
              })}

              {renderFooter ? (
                renderFooter(rows, operation)
              ) : canAdd ? (
                <FormItem className="mb-0">
                  <Button theme="primary" variant="dashed" onClick={() => operation.add(resolveDefaultRow(fieldList))}>
                    {addText}
                  </Button>
                </FormItem>
              ) : null}
            </>
          )
        }}
      </FieldList>
    </div>
  )
}

function renderFormField(config: FormConfig, index: number): ReactNode {
  const { colProps, component, bare, fieldList, ...formItemProps } = config
  return (
    <Col
      {...(colProps ?? DEFAULT_FORM_COL)}
      key={toReactKey(config.name, index)}
      className={clsx("basic-form__col", colProps?.className)}
    >
      {fieldList ? renderFieldList(config) : bare ? component : <FormItem {...formItemProps}>{component}</FormItem>}
    </Col>
  )
}

export type { BasicFormProps }

export default function BasicForm(props: BasicFormProps) {
  const {
    onReset,
    onSubmit,
    rules = {},
    formConfig,
    extra,
    extraClassName,
    gutter = [16, 0],
    reserveErrorSpace = true,
    className,
    ...args
  } = props

  return (
    <Form
      colon
      labelAlign="right"
      statusIcon={false}
      onReset={onReset}
      onSubmit={onSubmit}
      rules={rules}
      className={clsx("basic-form", reserveErrorSpace ? "basic-form--reserve-error" : "basic-form--dense", className)}
      {...args}
    >
      <div className={clsx("flex w-full gap-3", extra ? "items-start" : undefined)}>
        <Row gutter={gutter} align="top" className={clsx("basic-form__row min-w-0", extra && "flex-1")}>
          {formConfig.map((config, index) => renderFormField(config, index))}
        </Row>
        {extra ? <div className={clsx("flex shrink-0 items-center pt-1", extraClassName)}>{extra}</div> : null}
      </div>
    </Form>
  )
}
