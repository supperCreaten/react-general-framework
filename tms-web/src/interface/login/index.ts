/** 登录页视图 */
export type LoginView = "login" | "changePassword"

export interface LoginFormValues {
  account?: string
  password?: string
  captcha?: string
  rememberMe?: boolean
}

export interface LoginFormProps {
  onForgotPassword?: () => void
  onNeedChangePassword?: () => void
}

export interface ChangePasswordFormValues {
  account?: string
  password?: string
  confirmPassword?: string
}

export interface ChangePasswordFormProps {
  onBackToLogin?: () => void
  onBack?: () => void
  onSuccess?: () => void
}

export type PasswordStrengthLevel = "empty" | "weak" | "medium" | "strong"

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel
  score: number
  percent: number
  label: string
  tips: string[]
}

export interface PasswordStrengthHintProps {
  password?: string
}
