import type { PasswordStrengthLevel, PasswordStrengthResult } from "@/interface/login";

export type { PasswordStrengthLevel, PasswordStrengthResult };

const LEVEL_META: Record<
  Exclude<PasswordStrengthLevel, "empty">,
  { label: string; percent: number }
> = {
  weak: { label: "弱", percent: 33 },
  medium: { label: "中", percent: 66 },
  strong: { label: "强", percent: 100 },
};

/** 根据规则计算密码强度等级、得分与改进提示 */
export function getPasswordStrength(password: string): PasswordStrengthResult {
  const value = password ?? "";
  if (!value) {
    return { level: "empty", score: 0, percent: 0, label: "", tips: [] };
  }

  const checks = [
    { ok: value.length >= 6, tip: "至少 6 位" },
    { ok: value.length >= 10, tip: "建议 10 位以上" },
    { ok: /[a-z]/.test(value), tip: "包含小写字母" },
    { ok: /[A-Z]/.test(value), tip: "包含大写字母" },
    { ok: /\d/.test(value), tip: "包含数字" },
    { ok: /[^A-Za-z0-9]/.test(value), tip: "包含特殊字符" },
  ];

  const score = checks.filter((item) => item.ok).length;
  const tips = checks.filter((item) => !item.ok).map((item) => item.tip);

  let level: Exclude<PasswordStrengthLevel, "empty"> = "weak";
  if (score >= 5) level = "strong";
  else if (score >= 3) level = "medium";

  return {
    level,
    score,
    percent: LEVEL_META[level].percent,
    label: LEVEL_META[level].label,
    tips,
  };
}
