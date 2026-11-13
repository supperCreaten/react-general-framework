import { useEffect, useMemo, useState } from "react"
import { Form, Input, type FormRule } from "tdesign-react"
import api from "@/api"
import BasicDialog from "@/components/BasicDialog"
import PasswordStrength from "@/components/PasswordStrength"
import { validatePasswordStrength } from "@/components/PasswordStrength/validate"
import { showMessage } from "@/utils/methods"

const { FormItem } = Form

const PASSWORD_RULES: FormRule[] = [
  { required: true, message: "请输入新密码" },
  { min: 6, message: "密码长度不能少于6位" },
  { max: 20, message: "密码长度不能超过20位" },
  {
    validator: (val) => validatePasswordStrength(String(val ?? "")).ok,
    message: "密码强度过弱，请包含大小写字母、数字或特殊字符",
  },
]

type ResetPwdFormValues = {
  password?: string
  confirmPassword?: string
}

export type ResetPwdProps = {
  visible: boolean
  userId?: string
  userName?: string
  account?: string
  onClose: (submitted?: boolean) => void
}

export default function ResetPwd(props: ResetPwdProps) {
  const { visible, userId, userName, account, onClose } = props
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const password = (Form.useWatch("password", form) as string) || ""

  const displayName = userName || account || userId || "-"

  const confirmRules = useMemo<FormRule[]>(
    () => [
      { required: true, message: "请再次输入新密码" },
      {
        validator: (val) => !val || val === form.getFieldValue("password"),
        message: "两次输入的密码不一致",
      },
    ],
    [form],
  )

  useEffect(() => {
    if (!visible) return
    form.reset()
    queueMicrotask(() => form.clearValidate?.())
  }, [visible, form])

  const handleSubmit = async () => {
    const validate = await form.validate()
    if (validate !== true) return
    if (!userId) return

    const values = form.getFieldsValue(true) as ResetPwdFormValues
    setSubmitting(true)
    try {
      await api.resetUserPassword({
        userId,
        password: values.password,
      })
      showMessage(`用户「${displayName}」密码重置成功`, "success")
      onClose(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BasicDialog
      visible={visible}
      header="重置密码"
      width={480}
      confirmLoading={submitting}
      confirmText="确认"
      onClose={() => onClose()}
      onConfirm={() => void handleSubmit()}
    >
      <div className="mb-4 rounded border border-(--td-component-border) bg-(--td-bg-color-container) px-3 py-2 text-sm text-(--td-text-color-secondary)">
        正在为用户
        <span className="mx-1 font-medium text-(--td-text-color-primary)">{displayName}</span>
        {account ? (
          <>
            （账号：
            <span className="font-medium text-(--td-text-color-primary)">{account}</span>）
          </>
        ) : null}
        设置新密码
      </div>

      <Form form={form} labelAlign="right" labelWidth={90} colon statusIcon={false} requiredMark>
        <FormItem
          label="新密码"
          name="password"
          rules={PASSWORD_RULES}
          help={password ? <PasswordStrength password={password} /> : undefined}
        >
          <Input type="password" clearable autocomplete="new-password" placeholder="请输入 6-20 位新密码" />
        </FormItem>
        <FormItem label="确认密码" name="confirmPassword" rules={confirmRules}>
          <Input type="password" clearable autocomplete="new-password" placeholder="请再次输入新密码" />
        </FormItem>
      </Form>
    </BasicDialog>
  )
}
