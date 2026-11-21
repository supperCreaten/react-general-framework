import api from "@/api"
import ContentSection from "@/components/ContentSection"
import type { RootState } from "@/store"
import { setUserInfo, type UserInfoApiRes } from "@/store/modules/user"
import { resolvePublicUrl } from "@/utils/image"
import { showMessage, useAppDispatch } from "@/utils/methods"
import InputText from "@/components/InputText"
import {
  BuildingIcon,
  CalendarIcon,
  CameraIcon,
  LockOnIcon,
  MailIcon,
  MobileIcon,
  UserIcon,
  UsergroupIcon,
} from "tdesign-icons-react"
import {
  Avatar,
  Button,
  Form,
  Radio,
  Tabs,
  Tag,
  Upload,
  type FormRules,
  type SubmitContext,
  type UploadFile,
  type UploadProps,
} from "tdesign-react"
import type { TdFormProps } from "tdesign-react/es/form/type"
import { useEffect, useMemo, useReducer } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import "./index.css"

const { FormItem } = Form
const { TabPanel } = Tabs

type ProfileFormValues = {
  nickName: string
  phonenumber: string
  email: string
  sex: string
}

type PasswordFormValues = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

/** 将未知值转为去首尾空格的展示文本 */
function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim()
}

/** 将接口时间格式化为本地 `YYYY-MM-DD HH:mm:ss` */
function formatDateTime(value: unknown) {
  const text = asText(value)
  if (!text) return ""
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return text
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** 按中英文逗号拆分角色名称列表 */
function splitRoles(roleName: unknown) {
  return asText(roleName)
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const cardClassName =
  "overflow-hidden rounded-2xl border border-[rgb(15_23_42/5%)] bg-white shadow-[0_1px_2px_rgb(15_23_42/3%),0_12px_32px_rgb(15_23_42/5%)]"

type ProfileUiState = {
  activeTab: string
  savingProfile: boolean
  savingPassword: boolean
  uploadingAvatar: boolean
}

const initialProfileUiState: ProfileUiState = {
  activeTab: "basic",
  savingProfile: false,
  savingPassword: false,
  uploadingAvatar: false,
}

function profileUiReducer(state: ProfileUiState, patch: Partial<ProfileUiState>): ProfileUiState {
  return { ...state, ...patch }
}

export default function MyProfilePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const fallbackAvatar = useSelector((state: RootState) => state.user.avatar)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [ui, setUi] = useReducer(profileUiReducer, initialProfileUiState)
  const { activeTab, savingProfile, savingPassword, uploadingAvatar } = ui

  const account = asText(userInfo.account) || asText(userInfo.userName)
  const nickName = asText(userInfo.nickName) || account || "用户"
  const phone = asText(userInfo.phonenumber)
  const email = asText(userInfo.email)
  const deptName = asText(userInfo.deptName)
  const createTime = formatDateTime(userInfo.createTime)
  const roles = useMemo(() => splitRoles(userInfo.roleName), [userInfo.roleName])
  const avatarUrl =
    resolvePublicUrl(userInfo.avatar) ||
    resolvePublicUrl(userInfo.fullAvatar) ||
    resolvePublicUrl(fallbackAvatar) ||
    fallbackAvatar

  useEffect(() => {
    profileForm.setFieldsValue({
      nickName: asText(userInfo.nickName),
      phonenumber: asText(userInfo.phonenumber),
      email: asText(userInfo.email),
      sex: asText(userInfo.sex) || "男",
    })
  }, [profileForm, userInfo])

  const refreshUserInfo = async () => {
    const next = await api.getUserInfo<UserInfoApiRes>()
    dispatch(setUserInfo(next))
  }

  const profileRules: FormRules<ProfileFormValues> = {
    nickName: [{ required: true, message: "请输入昵称", type: "error" }],
    phonenumber: [
      { required: true, message: "请输入手机号码", type: "error" },
      { pattern: /^1\d{10}$/, message: "请输入正确的手机号码", type: "error" },
    ],
    email: [
      { required: true, message: "请输入邮箱", type: "error" },
      { email: true, message: "请输入正确的邮箱地址", type: "error" },
    ],
    sex: [{ required: true, message: "请选择性别", type: "error" }],
  }

  const passwordRules: FormRules<PasswordFormValues> = {
    oldPassword: [{ required: true, message: "请输入旧密码", type: "error" }],
    newPassword: [
      { required: true, message: "请输入新密码", type: "error" },
      { min: 5, message: "新密码长度需为 5-20 位", type: "error" },
      { max: 20, message: "新密码长度需为 5-20 位", type: "error" },
    ],
    confirmPassword: [
      { required: true, message: "请再次输入新密码", type: "error" },
      {
        validator: (val) =>
          val === passwordForm.getFieldValue("newPassword")
            ? true
            : { result: false, message: "两次输入的新密码不一致", type: "error" },
      },
    ],
  }

  /** 保存基本资料并刷新全局用户信息 */
  const handleSaveProfile: TdFormProps["onSubmit"] = async (context: SubmitContext) => {
    if (context.validateResult !== true) return
    const values = profileForm.getFieldsValue(true) as ProfileFormValues
    setUi({ savingProfile: true })
    try {
      await api.updateProfile({
        nickName: values.nickName?.trim(),
        phonenumber: values.phonenumber?.trim(),
        email: values.email?.trim(),
        sex: values.sex,
      })
      await refreshUserInfo()
      showMessage("基本资料已保存", "success")
    } catch {
      /* 错误提示由请求拦截器处理 */
    } finally {
      setUi({ savingProfile: false })
    }
  }

  /** 校验并提交修改登录密码 */
  const handleSavePassword: TdFormProps["onSubmit"] = async (context: SubmitContext) => {
    if (context.validateResult !== true) return
    const values = passwordForm.getFieldsValue(true) as PasswordFormValues
    setUi({ savingPassword: true })
    try {
      await api.updateProfilePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      passwordForm.reset()
      showMessage("密码修改成功", "success")
    } catch {
      /* 错误提示由请求拦截器处理 */
    } finally {
      setUi({ savingPassword: false })
    }
  }

  /** 自定义头像上传并更新用户头像 */
  const handleAvatarRequest: UploadProps["requestMethod"] = async (file) => {
    const raw = Array.isArray(file) ? file[0] : file
    const uploadFile = raw as UploadFile
    const blob = uploadFile.raw
    if (!blob) {
      return { status: "fail", error: "未选择文件", response: {} }
    }
    setUi({ uploadingAvatar: true })
    try {
      const formData = new FormData()
      formData.append("file", blob)
      await api.uploadUserAvatar(formData)
      await refreshUserInfo()
      showMessage("头像更新成功", "success")
      return { status: "success", response: {} }
    } catch (error) {
      return {
        status: "fail",
        error: (error as { msg?: string; message?: string })?.msg || "头像上传失败",
        response: {},
      }
    } finally {
      setUi({ uploadingAvatar: false })
    }
  }

  const infoItems = [
    { key: "account", icon: <UserIcon size={16} />, label: "账号", value: account },
    { key: "phone", icon: <MobileIcon size={16} />, label: "手机号码", value: phone },
    { key: "email", icon: <MailIcon size={16} />, label: "用户邮箱", value: email },
    { key: "dept", icon: <BuildingIcon size={16} />, label: "所属部门", value: deptName },
    { key: "roles", icon: <UsergroupIcon size={16} />, label: "所属角色", value: roles },
    { key: "createTime", icon: <CalendarIcon size={16} />, label: "创建日期", value: createTime },
  ] as const

  return (
    <ContentSection isFull isContentFullCard={false} className="p-0!">
      <ContentSection.Content>
        <div className="box-border h-full min-h-full overflow-auto px-6 py-5 pb-7 bg-[radial-gradient(ellipse_55%_36%_at_8%_0%,rgb(15_143_130/10%),transparent_58%),radial-gradient(ellipse_48%_30%_at_100%_0%,rgb(45_140_255/7%),transparent_52%),linear-gradient(180deg,#f5f8fb_0%,#eef3f7_100%)]">
          <div className="grid max-w-7xl grid-cols-[minmax(380px,440px)_minmax(0,1fr)] items-start gap-5 max-[1100px]:grid-cols-[minmax(340px,400px)_minmax(0,1fr)] max-[960px]:grid-cols-1">
            <aside className={`relative ${cardClassName}`}>
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-29.5 bg-[linear-gradient(135deg,rgb(15_143_130/16%)_0%,rgb(11_111_138/10%)_48%,rgb(45_140_255/8%)_100%)]"
                aria-hidden
              />
              <div className="relative z-1 flex items-center justify-between gap-3 px-6 pt-4.5 pb-3.5">
                <h2 className="m-0 text-base font-[650] tracking-[0.03em] text-slate-900">个人信息</h2>
              </div>
              <div className="relative z-1 px-6 pt-2 pb-6">
                <div className="mb-2 flex flex-col items-center gap-2 border-b border-[rgb(15_23_42/6%)] py-2 pb-5.5">
                  <Upload
                    theme="custom"
                    accept="image/*"
                    disabled={uploadingAvatar}
                    requestMethod={handleAvatarRequest}
                    showUploadProgress={false}
                  >
                    <div
                      className="profile-avatar-wrap group relative cursor-pointer rounded-full bg-[linear-gradient(145deg,#2de3c8,#0f8f82_55%,#0b6f8a)] p-1 shadow-[0_10px_28px_rgb(15_143_130/28%)]"
                      title="点击更换头像"
                    >
                      <Avatar image={avatarUrl} size="96px" alt={nickName}>
                        {nickName.slice(0, 1)}
                      </Avatar>
                      <span className="pointer-events-none absolute inset-1 grid place-items-center rounded-full bg-[rgb(7_24_36/52%)] text-white opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                        <CameraIcon size={22} />
                      </span>
                    </div>
                  </Upload>
                  <p className="mt-2.5 mb-0 text-xl font-bold tracking-[0.02em] text-slate-900">{nickName}</p>
                  {account ? (
                    <p className="m-0 rounded-full bg-[rgb(15_143_130/8%)] px-2.5 py-0.5 text-xs tracking-[0.04em] text-[#0f8f82]">
                      @{account}
                    </p>
                  ) : null}
                </div>

                <ul className="mt-4 mb-0 flex list-none flex-col gap-2 p-0">
                  {infoItems.map((item) => (
                    <li
                      key={item.key}
                      className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-3.5 rounded-xl bg-slate-50 px-3 py-3 transition-[background,transform] duration-200 ease-out hover:bg-[#f1f7f6] max-[960px]:grid-cols-[110px_minmax(0,1fr)]"
                    >
                      <span className="inline-flex items-center gap-2.5 text-[13px] leading-5.5 text-slate-500">
                        <span className="inline-grid size-7 shrink-0 place-items-center rounded-lg bg-[rgb(15_143_130/10%)] text-[#0f8f82]">
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                      <div className="min-w-0 pt-0.75 text-right text-[13px] font-medium leading-5.5 wrap-break-word text-slate-800">
                        {item.key === "roles" ? (
                          Array.isArray(item.value) && item.value.length ? (
                            <div className="flex flex-wrap justify-end gap-1.5">
                              {item.value.map((role) => (
                                <Tag key={role} variant="light" theme="primary" size="small">
                                  {role}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            <span className="font-normal text-slate-400">未分配</span>
                          )
                        ) : item.value ? (
                          item.value
                        ) : (
                          <span className="font-normal text-slate-400">未填写</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <section className={`relative min-h-140 ${cardClassName}`}>
              <div className="relative z-1 flex items-center justify-between gap-3 px-7 pt-5">
                <h2 className="relative m-0 pl-3 text-base font-[650] tracking-[0.03em] text-slate-900 before:absolute before:top-1/2 before:left-0 before:h-4 before:w-0.75 before:-translate-y-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#2de3c8,#0f8f82)] before:content-['']">
                  基本资料
                </h2>
              </div>
              <div className="profile-panel-body px-5 pt-2 pb-7">
                <Tabs value={activeTab} onChange={(value) => setUi({ activeTab: String(value) })}>
                  <TabPanel value="basic" label="基本资料">
                    <div className="profile-form-wrap mt-4.5 max-w-155 rounded-[14px] border border-[rgb(15_23_42/5%)] bg-[linear-gradient(180deg,#fcfdff_0%,#f7fafc_100%)] px-6 pt-6 pb-5 shadow-[inset_0_1px_0_rgb(255_255_255/80%)]">
                      <p className="mb-4.5 mt-0 text-[13px] leading-[1.6] text-slate-500">
                        维护对外展示的联系方式与基础身份信息，保存后立即生效。
                      </p>
                      <Form
                        form={profileForm}
                        labelWidth={96}
                        labelAlign="right"
                        rules={profileRules}
                        disabled={savingProfile}
                        onSubmit={handleSaveProfile}
                      >
                        <FormItem label="昵称" name="nickName">
                          <InputText clearable maxlength={30} placeholder="请输入昵称" />
                        </FormItem>
                        <FormItem label="手机号码" name="phonenumber">
                          <InputText clearable maxlength={11} placeholder="请输入手机号码" />
                        </FormItem>
                        <FormItem label="邮箱" name="email">
                          <InputText clearable maxlength={50} placeholder="请输入邮箱" />
                        </FormItem>
                        <FormItem label="性别" name="sex">
                          <Radio.Group>
                            <Radio value="男">男</Radio>
                            <Radio value="女">女</Radio>
                          </Radio.Group>
                        </FormItem>
                        <FormItem className="profile-form-actions-item" labelWidth={0}>
                          <div className="profile-form-actions mt-2.5 flex w-full items-center justify-center gap-3 border-t border-dashed border-slate-200 pt-4.5">
                            <Button type="submit" theme="primary" loading={savingProfile}>
                              保存
                            </Button>
                            <Button
                              theme="default"
                              variant="outline"
                              onClick={() => navigate(-1)}
                              disabled={savingProfile}
                            >
                              关闭
                            </Button>
                          </div>
                        </FormItem>
                      </Form>
                    </div>
                  </TabPanel>

                  <TabPanel value="password" label="修改密码">
                    <div className="profile-form-wrap mt-4.5 max-w-155 rounded-[14px] border border-[rgb(15_23_42/5%)] bg-[linear-gradient(180deg,#fcfdff_0%,#f7fafc_100%)] px-6 pt-6 pb-5 shadow-[inset_0_1px_0_rgb(255_255_255/80%)]">
                      <p className="mb-4.5 mt-0 text-[13px] leading-[1.6] text-slate-500">
                        定期更新登录密码有助于保障账号安全，建议使用字母与数字组合。
                      </p>
                      <Form
                        form={passwordForm}
                        labelWidth={96}
                        labelAlign="right"
                        rules={passwordRules}
                        disabled={savingPassword}
                        onSubmit={handleSavePassword}
                      >
                        <FormItem label="旧密码" name="oldPassword">
                          <InputText
                            type="password"
                            clearable
                            prefixIcon={<LockOnIcon />}
                            placeholder="请输入旧密码"
                            autocomplete="current-password"
                          />
                        </FormItem>
                        <FormItem label="新密码" name="newPassword">
                          <InputText
                            type="password"
                            clearable
                            prefixIcon={<LockOnIcon />}
                            placeholder="请输入新密码"
                            autocomplete="new-password"
                          />
                        </FormItem>
                        <FormItem label="确认密码" name="confirmPassword">
                          <InputText
                            type="password"
                            clearable
                            prefixIcon={<LockOnIcon />}
                            placeholder="请再次输入新密码"
                            autocomplete="new-password"
                          />
                        </FormItem>
                        <FormItem className="profile-form-actions-item" labelWidth={0}>
                          <div className="profile-form-actions mt-2.5 flex w-full items-center justify-center gap-3 border-t border-dashed border-slate-200 pt-4.5">
                            <Button type="submit" theme="primary" loading={savingPassword}>
                              保存
                            </Button>
                            <Button
                              theme="default"
                              variant="outline"
                              onClick={() => passwordForm.reset()}
                              disabled={savingPassword}
                            >
                              重置
                            </Button>
                          </div>
                        </FormItem>
                      </Form>
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </section>
          </div>
        </div>
      </ContentSection.Content>
    </ContentSection>
  )
}
