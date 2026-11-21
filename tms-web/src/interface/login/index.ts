/** 登录页视图 */
export type LoginView = "login" | "changePassword"

/** 登录表单值 */
export type LoginFormValues = {
  account: string
  password: string
}

/** 登录表单 Props */
export type LoginFormProps = {
  onForgotPassword?: () => void
}

/** 修改密码表单值（登录页） */
export type ChangePasswordFormValues = {
  account: string
  password: string
  confirmPassword: string
}

/** 修改密码表单 Props */
export type ChangePasswordFormProps = {
  onBackToLogin?: () => void
}

/** 密码强度等级 */
export type PasswordStrengthLevel = "empty" | "weak" | "medium" | "strong"

/** 密码强度计算结果 */
export type PasswordStrengthResult = {
  level: PasswordStrengthLevel
  score: number
  percent: number
  label: string
  tips: string[]
}

/** 密码强度提示 Props */
export type PasswordStrengthHintProps = {
  password?: string
}