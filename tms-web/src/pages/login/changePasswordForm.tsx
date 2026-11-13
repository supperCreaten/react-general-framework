import { useState } from "react";
import { Button, Form, Input, type FormRules, type SubmitContext } from "tdesign-react";
import type { TdFormProps } from "tdesign-react/es/form/type";
import { LockOnIcon, UserIcon } from "tdesign-icons-react";
import api from "@/api";
import { aesEncrypt } from "@/utils/auth";
import { showMessage } from "@/utils/methods";
import PasswordStrengthHint from "./PasswordStrengthHint";

const { FormItem } = Form;

type ChangePasswordFormValues = {
  account: string;
  password: string;
  confirmPassword: string;
};

type ChangePasswordFormProps = {
  onBackToLogin?: () => void;
};

export default function ChangePasswordForm({ onBackToLogin }: ChangePasswordFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const password = (Form.useWatch("password", form) as string) || "";

  const rules: FormRules<ChangePasswordFormValues> = {
    account: [{ required: true, message: "请输入账号", type: "error" }],
    password: [
      { required: true, message: "请输入新密码", type: "error" },
      { min: 6, message: "密码至少 6 位", type: "error" },
      { max: 20, message: "密码长度不能超过 20 位", type: "error" },
    ],
    confirmPassword: [
      { required: true, message: "请再次输入新密码", type: "error" },
      {
        validator: (val) => val === form.getFieldValue("password"),
        message: "两次输入的密码不一致",
        type: "error",
      },
    ],
  };

  const handleSubmit: TdFormProps["onSubmit"] = async (context: SubmitContext) => {
    if (context.validateResult !== true) return;

    const values = form.getFieldsValue(true) as ChangePasswordFormValues;
    const account = values.account?.trim() ?? "";
    const nextPassword = values.password ?? "";

    setLoading(true);
    try {
      await api.changePassword({
        account: aesEncrypt(account),
        password: aesEncrypt(nextPassword),
      });
      showMessage("密码修改成功，请使用新密码登录", "success");
      form.reset();
      onBackToLogin?.();
    } catch (err) {
      const msg =
        (err as { msg?: string; message?: string; response?: { data?: { msg?: string } } })
          ?.response?.data?.msg ||
        (err as { msg?: string; message?: string })?.msg ||
        (err as { message?: string })?.message ||
        "修改密码失败，请稍后重试";
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      className="login-form"
      form={form}
      labelAlign="top"
      labelWidth="100%"
      requiredMark={false}
      rules={rules}
      disabled={loading}
      onSubmit={handleSubmit}
    >
      <FormItem label="账号" name="account">
        <Input
          clearable
          autocomplete="username"
          placeholder="请输入账号"
          prefixIcon={<UserIcon />}
        />
      </FormItem>

      <FormItem
        label="新密码"
        name="password"
        help={password ? <PasswordStrengthHint password={password} /> : null}
      >
        <Input
          type="password"
          autocomplete="new-password"
          placeholder="请输入新密码"
          prefixIcon={<LockOnIcon />}
        />
      </FormItem>

      <FormItem label="确认密码" name="confirmPassword">
        <Input
          type="password"
          autocomplete="new-password"
          placeholder="请再次输入新密码"
          prefixIcon={<LockOnIcon />}
        />
      </FormItem>

      <FormItem className="login-submit-item">
        <Button theme="primary" type="submit" block loading={loading} className="login-submit-btn">
          确认修改
        </Button>
      </FormItem>

      <div className="login-extra login-extra--center">
        <Button
          theme="primary"
          variant="text"
          className="login-forgot-link"
          disabled={loading}
          onClick={onBackToLogin}
        >
          返回登录
        </Button>
      </div>
    </Form>
  );
}
