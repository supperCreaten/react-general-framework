import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Form, Input, type FormRules, type SubmitContext } from "tdesign-react"
import type { TdFormProps } from "tdesign-react/es/form/type"
import { LockOnIcon, UserIcon } from "tdesign-icons-react"
import api from "@/api"
import BasicForm from "@/components/BasicForm"
import type { FormConfig } from "@/interface"
import { aesEncrypt, setAccessToken } from "@/utils/auth"
import { showMessage } from "@/utils/methods"

type LoginFormValues = {
  account: string
  password: string
}

type LoginFormProps = {
  onForgotPassword?: () => void
}

const rules: FormRules<LoginFormValues> = {
  account: [{ required: true, message: "请输入账号", type: "error" }],
  password: [
    { required: true, message: "请输入密码", type: "error" },
    { min: 5, message: "密码长度需为 5-20 位", type: "error" },
    { max: 20, message: "密码长度需为 5-20 位", type: "error" },
  ],
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const formConfig: FormConfig[] = [
    {
      label: "账号",
      name: "account",
      colProps: { span: 12 },
      component: (
        <Input
          clearable
          size="large"
          autocomplete="username"
          placeholder="请输入账号"
          prefixIcon={<UserIcon />}
        />
      ),
    },
    {
      label: "密码",
      name: "password",
      colProps: { span: 12 },
      component: (
        <Input
          type="password"
          size="large"
          autocomplete="current-password"
          placeholder="请输入密码"
          prefixIcon={<LockOnIcon />}
        />
      ),
    },
    {
      bare: true,
      colProps: { span: 12 },
      component: (
        <div className="login-extra">
          <Button
            theme="primary"
            variant="text"
            className="login-forgot-link"
            disabled={!onForgotPassword || loading}
            onClick={onForgotPassword}
          >
            忘记密码？
          </Button>
        </div>
      ),
    },
    {
      bare: true,
      colProps: { span: 12 },
      component: (
        <Button
          theme="primary"
          type="submit"
          block
          size="large"
          loading={loading}
          className="login-submit-btn"
        >
          登录
        </Button>
      ),
    },
  ]

  const handleSubmit: TdFormProps["onSubmit"] = async (context: SubmitContext) => {
    if (context.validateResult !== true) return

    const values = form.getFieldsValue(true) as LoginFormValues
    const account = values.account?.trim() ?? ""
    const password = values.password ?? ""

    setLoading(true)
    try {
      const token = await api.login({
        account: aesEncrypt(account),
        password: aesEncrypt(password),
      })
      const accessToken = typeof token === "string" ? token : ""
      if (!accessToken) {
        throw new Error("登录失败，未获取到访问令牌")
      }
      setAccessToken(accessToken)
      navigate(import.meta.env.VITE_BASE_HOME_PATH || "/home", { replace: true })
    } catch (err) {
      const msg =
        (err as { msg?: string; message?: string; response?: { data?: { msg?: string } } })?.response?.data?.msg ||
        (err as { msg?: string; message?: string })?.msg ||
        (err as { message?: string })?.message ||
        "登录失败，请稍后重试"
      showMessage(msg, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <BasicForm
      className="login-form"
      formConfig={formConfig}
      form={form}
      labelAlign="top"
      labelWidth="100%"
      requiredMark={false}
      rules={rules}
      disabled={loading}
      onSubmit={handleSubmit}
    />
  )
}
