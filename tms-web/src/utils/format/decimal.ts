/** 不允许输入 0 的字段，可按业务在此追加 */
const DISALLOW_ZERO_FIELDS = new Set<string>(["quantity", "taxInclusiveUnitPrice"])

export type DecimalFormatOptions = {
  /** 字段名：在 DISALLOW_ZERO_FIELDS 中则禁止最终为 0 */
  field?: string
  /** 强制禁止最终为 0（正数场景） */
  disallowZero?: boolean
}

/**
 * 禁止最终值为 0（含 0、0.0、0.00）。
 * 输入中允许 "0." / "0.0" 等中间态，以便继续输入 0.x。
 */
const disallowZeroValue = (value: string, place = 4) => {
  if (!value) return value
  if (value.endsWith(".")) return value
  if (place > 1 && new RegExp(`^0\\.0{1,${place - 1}}$`).test(value)) return value
  const num = Number(value)
  if (!Number.isNaN(num) && num === 0) return ""
  return value
}

function shouldDisallowZero(options?: DecimalFormatOptions) {
  return Boolean(options?.disallowZero || (options?.field && DISALLOW_ZERO_FIELDS.has(options.field)))
}

/**
 * 去掉小数末尾连续的 0，以及多余的小数点。
 * 如 25.00 → 25，32.0100 → 32.01，52. → 52
 */
export const trimTrailingZeros = (value: string) => {
  if (!value || !value.includes(".")) return value
  return value.replace(/0+$/, "").replace(/\.$/, "")
}

/**
 * 失焦规范化：先去尾零，再按需禁止 0。
 */
export const normalizeDecimalOnBlur = (value: string, options?: DecimalFormatOptions) => {
  const trimmed = trimTrailingZeros(value.trim())
  if (!trimmed) return ""
  if (shouldDisallowZero(options)) {
    const num = Number(trimmed)
    if (!Number.isNaN(num) && num === 0) return ""
  }
  return trimmed
}

/**
 * 格式化小数位数（输入过程中使用，不去除末尾 0）
 */
export const formartDecimalPlaces = (value: string, place = 4, options?: DecimalFormatOptions) => {
  const reg = new RegExp(`^(\\d+)\\.(\\d{${place}}).*$`)
  let result = value
    .replace(/[^0-9.]/g, "")
    .replace(/^\./, "0.")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(reg, "$1.$2")
    .replace(/^0+(\d)/, "$1")

  if (shouldDisallowZero(options)) {
    result = disallowZeroValue(result, place)
  }

  return result
}

/** 限制输入为正整数或 0（不允许小数）；带小数时取整数部分，如 52.00 → 52 */
export const formartInteger = (value: string) => {
  const intPart = value.replace(/[^\d.]/g, "").split(".")[0] ?? ""
  return intPart.replace(/^0+(\d)/, "$1")
}

/** 限制输入为正整数（不含 0、不含小数） */
export const formartPositiveInteger = (value: string) => {
  const next = formartInteger(value)
  return next === "0" ? "" : next
}
