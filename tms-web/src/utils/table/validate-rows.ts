import { createElement } from "react"
import type { TableRowData } from "tdesign-react"
import { MessagePlugin, NotificationPlugin } from "tdesign-react"
import type {
  TableFieldRule,
  TableRowFieldError,
  ValidateTableRowsOptions,
  ValidateTableRowsResult,
} from "@/interface/common"

export type { TableFieldRule, TableRowFieldError, ValidateTableRowsOptions, ValidateTableRowsResult }

function isEmptyValue(value: unknown) {
  if (value == null) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  return false
}

function resolveRequiredMessage(rule: TableFieldRule<TableRowData>) {
  if (typeof rule.required === "string") return rule.required
  return `${rule.field}不能为空`
}

/** 将错误按行合并成「第N行：a；b」列表 */
export function formatTableRowMessages(errors: TableRowFieldError[]) {
  const byRow = new Map<number, string[]>()
  for (const err of errors) {
    const list = byRow.get(err.rowIndex) ?? []
    list.push(err.message)
    byRow.set(err.rowIndex, list)
  }
  return [...byRow.entries()]
    .sort(([a], [b]) => a - b)
    .map(([rowIndex, messages]) => `第${rowIndex + 1}行：${messages.join("；")}`)
}

/** 弹出「校验未通过」通知（按行汇总，不改表格行样式） */
export function notifyTableValidateFail(rowMessages: string[], options?: { title?: string; duration?: number }) {
  if (!rowMessages.length) return
  const title = options?.title ?? "校验未通过"
  const duration = options?.duration ?? 4500
  NotificationPlugin.error({
    title,
    content: createElement(
      "div",
      {
        className: "table-validate-fail-content",
        style: { color: "var(--td-error-color)", lineHeight: "22px" },
      },
      rowMessages.map((msg) => createElement("div", { key: msg }, msg)),
    ),
    duration,
    placement: "top-right",
  })
}

/**
 * 对表格 `getDataSource()` 得到的数据进行校验。
 * 适合虚拟滚动场景：不依赖单元格 DOM，只校验数据本身。
 */
export function validateTableRows<T extends TableRowData>(
  options: ValidateTableRowsOptions<T>,
): ValidateTableRowsResult {
  const {
    rows,
    rules,
    rowKey = "id",
    minRows,
    minRowsMessage = "请至少添加一条数据",
    notify = true,
    notifyTitle = "校验未通过",
    notifyDuration = 4500,
  } = options

  const errors: TableRowFieldError[] = []

  if (minRows != null && rows.length < minRows) {
    const message = minRowsMessage
    errors.push({ rowKey: "", rowIndex: -1, field: "", message })
    const rowMessages = [message]
    if (notify) notifyTableValidateFail(rowMessages, { title: notifyTitle, duration: notifyDuration })
    return { valid: false, errors, rowMessages, firstMessage: message }
  }

  rows.forEach((row, rowIndex) => {
    const key = (row as Record<string, unknown>)[rowKey]
    const rowKeyValue = (key as string | number | undefined) ?? rowIndex

    for (const rule of rules) {
      const value = (row as Record<string, unknown>)[rule.field]

      if (rule.required) {
        if (isEmptyValue(value)) {
          errors.push({
            rowKey: rowKeyValue,
            rowIndex,
            field: rule.field,
            message: resolveRequiredMessage(rule as TableFieldRule<TableRowData>),
          })
          continue
        }
      }

      if (rule.validator) {
        const msg = rule.validator(value, row, rowIndex)
        if (msg) {
          errors.push({
            rowKey: rowKeyValue,
            rowIndex,
            field: rule.field,
            message: msg,
          })
        }
      }
    }
  })
  const rowMessages = formatTableRowMessages(errors)
  const valid = errors.length === 0
  if (!valid && notify) {
    notifyTableValidateFail(rowMessages, { title: notifyTitle, duration: notifyDuration })
  }

  return {
    valid,
    errors,
    rowMessages,
    firstMessage: rowMessages[0],
  }
}

/**
 * 校验表格 ref 的 getDataSource()；失败时弹出通知。
 * @returns 是否通过
 */
export function validateTableDataSource<T extends TableRowData>(
  getDataSource: (() => T[]) | undefined | null,
  options: Omit<ValidateTableRowsOptions<T>, "rows">,
): ValidateTableRowsResult | undefined {
  const rows = getDataSource?.() ?? []
  if (!rows?.length) {
    MessagePlugin.warning("请至少添加一条数据", 30 * 1000)
    return
  }
  return validateTableRows({ ...options, rows })
}
