/**
 * 判断给定的值是否为有限数字
 */
export function isNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * 判断一个值是否为字符串类型
 */
export function isString(value: unknown) {
  return typeof value === "string";
}

/**
 * 判断对象是否为空（null / undefined / 非对象 / 无自身可枚举键）
 */
export function isEmptyObject(value: unknown): boolean {
  return !value || typeof value !== "object" || Object.keys(value as object).length === 0;
}

/**
 * 判断是否为完整 SVG 字符串
 */
export function isSvgString(data: string | unknown): boolean {
  if (typeof data !== "string") return false;
  const svgRegex = /^<svg\b[^>]*>[\s\S]*<\/svg>$/i;
  return svgRegex.test(data.trim());
}

/**
 * 检查当前运行环境是否为 Windows OS
 */
export function isWindowsOs() {
  const windowsRegex = /windows|win32/i;
  return windowsRegex.test(navigator.userAgent);
}
