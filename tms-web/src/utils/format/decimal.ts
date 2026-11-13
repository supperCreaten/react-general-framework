/** 不允许输入 0 的字段，可按业务在此追加 */
const DISALLOW_ZERO_FIELDS = new Set<string>(["quantity", "taxInclusiveUnitPrice"]);

/**
 * 禁止最终值为 0（含 0、0.0、0.00、0.000）。
 * 输入中允许 "0." / "0.0" 等未写完的中间态，以便继续输入 0.x。
 */
const disallowZeroValue = (value: string, place = 4) => {
  if (!value) return value;
  // 中间态：以小数点结尾，如 "0."
  if (value.endsWith(".")) return value;
  // 中间态：0.0 / 0.00（小数位未满 place），便于继续输入更小小数
  if (place > 1 && new RegExp(`^0\\.0{1,${place - 1}}$`).test(value)) return value;
  const num = Number(value);
  if (!Number.isNaN(num) && num === 0) return "";
  return value;
};

/**
 * 去掉小数末尾连续的 0，以及多余的小数点。
 * 如 25.00 → 25，32.0100 → 32.01，52. → 52
 * 建议在 onBlur 时调用
 */
export const trimTrailingZeros = (value: string) => {
  if (!value || !value.includes(".")) return value;
  return value.replace(/0+$/, "").replace(/\.$/, "");
};

/**
 * 失焦规范化：先去尾零，再按字段禁止 0。
 * 25.00 → 25；32.0100 → 32.01；0 / 0.00 / 0.000 → ""
 */
export const normalizeDecimalOnBlur = (value: string, field?: string) => {
  const trimmed = trimTrailingZeros(value?.trim?.() ?? value);
  if (!trimmed) return "";
  if (field && DISALLOW_ZERO_FIELDS.has(field)) {
    const num = Number(trimmed);
    if (!Number.isNaN(num) && num === 0) return "";
  }
  return trimmed;
};

/**
 * 格式化小数位数（输入过程中使用，不去除末尾 0）
 * @param value 需要格式化的值
 * @param place 允许输入几位小数
 * @param field  格式化的字段（在 DISALLOW_ZERO_FIELDS 中则禁止输入 0）
 */
export const formartDecimalPlaces = (value: string, place: number = 4, field?: string) => {
  const reg = new RegExp(`^(\\d+)\\.(\\d{${place}}).*$`);
  let result = value
    .replace(/[^0-9.]/g, "")
    .replace(/^\./, "0.")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(reg, "$1.$2")
    .replace(/^0+(\d)/, "$1");

  if (field && DISALLOW_ZERO_FIELDS.has(field)) {
    result = disallowZeroValue(result, place);
  }

  return result;
};

/** 限制输入为正整数或 0（不允许小数）；带小数时取整数部分，如 52.00 → 52 */
export const formartInteger = (value: string) => {
  const intPart = value.replace(/[^\d.]/g, "").split(".")[0] ?? "";
  return intPart.replace(/^0+(\d)/, "$1");
};
