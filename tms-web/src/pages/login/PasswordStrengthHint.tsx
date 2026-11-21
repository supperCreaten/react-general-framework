import type { PasswordStrengthHintProps } from "@/interface/login";
import { getPasswordStrength } from "./passwordStrength";

export default function PasswordStrengthHint({ password = "" }: PasswordStrengthHintProps) {
  const strength = getPasswordStrength(password);
  if (strength.level === "empty") return null;

  return (
    <div className={`login-pwd-strength login-pwd-strength--${strength.level}`}>
      <div className="login-pwd-strength__row">
        <div className="login-pwd-strength__bar" aria-hidden>
          <span style={{ width: `${strength.percent}%` }} />
        </div>
        <span className="login-pwd-strength__label">强度：{strength.label}</span>
      </div>
      {strength.tips.length > 0 ? (
        <p className="login-pwd-strength__tips">建议：{strength.tips.slice(0, 3).join("、")}</p>
      ) : (
        <p className="login-pwd-strength__tips">密码强度较好</p>
      )}
    </div>
  );
}
