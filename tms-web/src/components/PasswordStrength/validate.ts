import { getPasswordStrength } from "@/pages/login/passwordStrength"

/** 校验密码至少达到中等强度 */
export function validatePasswordStrength(password?: string) {
  const strength = getPasswordStrength(password || "")
  if (strength.level === "empty") return { ok: false, message: "请输入密码" }
  if (strength.level === "weak") {
    return { ok: false, message: "密码强度过弱，请包含大小写字母、数字或特殊字符" }
  }
  return { ok: true, message: "" }
}
