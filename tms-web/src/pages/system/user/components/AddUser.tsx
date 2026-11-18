import { useEffect, useMemo, useReducer } from "react"
import { Form, Radio, Select, Textarea, TreeSelect, type TreeSelectProps } from "tdesign-react"
import api from "@/api"
import BasicDialog from "@/components/BasicDialog"
import BasicForm from "@/components/BasicForm"
import PasswordStrength from "@/components/PasswordStrength"
import { validatePasswordStrength } from "@/components/PasswordStrength/validate"
import type { FormConfig } from "@/interface"
import { showMessage } from "@/utils/methods"
import { markLazyChildren } from "@/utils/tree/lazy"
import InputText from "@/components/InputText"

type DeptTreeNode = {
  deptId: string | number
  deptName: string
  hasChildren?: boolean
  children?: DeptTreeNode[] | boolean
}

const SELECT_SCROLL = { type: "virtual" as const }

type OptionItem = { label: string; value: string }

type UserFormValues = {
  nickName?: string
  deptId?: string
  phone?: string
  email?: string
  account?: string
  password?: string
  sex?: string
  status?: string
  postId?: string
  roleIds?: string[]
  remark?: string
}

type UserDetail = {
  nickName?: string
  deptId?: string | number
  phone?: string
  phonenumber?: string
  email?: string
  account?: string
  userName?: string
  sex?: string
  status?: string | number
  postId?: string | number
  roleIds?: Array<string | number>
  remark?: string
}

const SEX_OPTIONS = [
  { label: "男", value: "男" },
  { label: "女", value: "女" },
  { label: "未知", value: "未知" },
]

const STATUS_OPTIONS = [
  { label: "正常", value: "0" },
  { label: "停用", value: "1" },
]

const initialValues: UserFormValues = {
  sex: "男",
  status: "0",
  roleIds: [],
  remark: "",
}

type AddUserState = {
  loading: boolean
  submitting: boolean
  deptTree: DeptTreeNode[]
  postOptions: OptionItem[]
  roleOptions: OptionItem[]
}

const initialAddUserState: AddUserState = {
  loading: false,
  submitting: false,
  deptTree: [],
  postOptions: [],
  roleOptions: [],
}

function addUserReducer(state: AddUserState, patch: Partial<AddUserState>): AddUserState {
  return { ...state, ...patch }
}

function asOptionValue(value?: string | number, fallback = "") {
  return value == null || value === "" ? fallback : `${value}`
}

function toLazyDeptNodes(list: DeptTreeNode[] = []): DeptTreeNode[] {
  return markLazyChildren(list as Array<Record<string, unknown>>, { idKey: "deptId" }) as DeptTreeNode[]
}

const loadDeptChildren = async (parentId: string | number) => {
  const data = await api.getDepts({ lazy: true, parentId, status: "0" })
  return toLazyDeptNodes(Array.isArray(data) ? (data as DeptTreeNode[]) : [])
}

function mapDetailToForm(data?: UserDetail): UserFormValues {
  return {
    nickName: data?.nickName,
    deptId: data?.deptId != null && data.deptId !== "" ? String(data.deptId) : undefined,
    phone: data?.phone || data?.phonenumber,
    email: data?.email,
    account: data?.account || data?.userName,
    password: undefined,
    sex: data?.sex || "男",
    status: asOptionValue(data?.status, "0"),
    postId: data?.postId != null && data.postId !== "" ? String(data.postId) : undefined,
    roleIds: (data?.roleIds ?? []).map((id) => String(id)),
    remark: data?.remark ?? "",
  }
}

export type AddUserProps = {
  visible: boolean
  title: string
  userId?: string
  defaultDeptId?: string
  onClose: (submitted?: boolean) => void
}

export default function AddUser(props: AddUserProps) {
  const { visible, title, userId, defaultDeptId, onClose } = props
  const [form] = Form.useForm()
  const [state, dispatch] = useReducer(addUserReducer, initialAddUserState)
  const { loading, submitting, deptTree, postOptions, roleOptions } = state
  const isEdit = Boolean(userId) && title.includes("修改")
  const password = (Form.useWatch("password", form) as string) || ""
  const selectedDeptId = Form.useWatch("deptId", form) as string | undefined

  const passwordRules = useMemo(
    () =>
      isEdit
        ? [
            { min: 6, message: "密码长度不能少于6位" },
            { max: 20, message: "密码长度不能超过20位" },
            {
              validator: (val: unknown) =>
                !val || validatePasswordStrength(String(val)).ok,
              message: "密码强度过弱，请包含大小写字母、数字或特殊字符",
            },
          ]
        : [
            { required: true, message: "请输入用户密码" },
            { min: 6, message: "密码长度不能少于6位" },
            { max: 20, message: "密码长度不能超过20位" },
            {
              validator: (val: unknown) => validatePasswordStrength(String(val ?? "")).ok,
              message: "密码强度过弱，请包含大小写字母、数字或特殊字符",
            },
          ],
    [isEdit],
  )

  const formConfig = useMemo(
    (): FormConfig[] => [
      {
        label: "昵称",
        name: "nickName",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请输入昵称" }],
        component: <InputText clearable placeholder="昵称" />,
      },
      {
        label: "归属部门",
        name: "deptId",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请选择归属部门" }],
        component: (
          <TreeSelect
            clearable
            filterable
            placeholder="请选择归属部门"
            data={deptTree as unknown as TreeSelectProps["data"]}
            keys={{ label: "deptName", value: "deptId", children: "children" }}
            treeProps={{
              load: async (node) => loadDeptChildren(node.value as string | number),
            }}
            onChange={() => {
              form.setFieldsValue({ postId: undefined })
            }}
          />
        ),
      },
      {
        label: "手机号码",
        name: "phone",
        colProps: { span: 6 },
        rules: [
          { required: true, message: "请输入手机号码" },
          { pattern: /^1\d{10}$/, message: "请输入正确的手机号码" },
        ],
        component: <InputText clearable maxlength={11} placeholder="请输入手机号码" />,
      },
      {
        label: "邮箱",
        name: "email",
        colProps: { span: 6 },
        rules: [{ email: true, message: "请输入正确的邮箱地址" }],
        component: <InputText clearable placeholder="请输入邮箱" />,
      },
      {
        label: "账号",
        name: "account",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请输入账号" }],
        component: <InputText clearable disabled={isEdit} placeholder="请输入账号" />,
      },
      {
        label: "用户密码",
        name: "password",
        colProps: { span: 6 },
        rules: passwordRules,
        component: (
          <InputText
            type="password"
            clearable
            autocomplete="new-password"
            placeholder={isEdit ? "不修改请留空" : "请输入 6-20 位密码"}
          />
        ),
      },
      {
        label: "用户性别",
        name: "sex",
        colProps: { span: 6 },
        component: <Select clearable placeholder="请选择" options={SEX_OPTIONS} />,
      },
      {
        label: "状态",
        name: "status",
        colProps: { span: 6 },
        component: <Radio.Group options={STATUS_OPTIONS} />,
      },
      {
        label: "岗位",
        name: "postId",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请选择岗位" }],
        component: (
          <Select
            clearable
            filterable
            placeholder={selectedDeptId ? "请选择岗位" : "请先选择归属部门"}
            disabled={!selectedDeptId}
            options={postOptions}
            scroll={SELECT_SCROLL}
          />
        ),
      },
      {
        label: "角色",
        name: "roleIds",
        colProps: { span: 6 },
        component: (
          <Select
            clearable
            filterable
            multiple
            placeholder="请选择"
            options={roleOptions}
            scroll={SELECT_SCROLL}
          />
        ),
      },
      {
        label: "备注",
        name: "remark",
        colProps: { span: 12 },
        component: (
          <Textarea maxlength={200} placeholder="请输入内容" autosize={{ minRows: 3, maxRows: 5 }} />
        ),
      },
    ],
    [deptTree, form, isEdit, passwordRules, postOptions, roleOptions, selectedDeptId],
  )

  const formConfigWithStrength = useMemo(
    () =>
      formConfig.map((item) =>
        item.name === "password"
          ? { ...item, tips: password ? <PasswordStrength password={password} /> : undefined }
          : item,
      ),
    [formConfig, password],
  )

  useEffect(() => {
    if (!visible) return
    const init = async () => {
      dispatch({ loading: true })
      try {
        form.reset()
        form.setFieldsValue({
          ...initialValues,
          ...(defaultDeptId ? { deptId: defaultDeptId } : {}),
        })
        dispatch({ postOptions: [] })

        const [deptRes, roleRes] = await Promise.all([
          loadDeptChildren(0),
          api.getRoleList<{ roleId: string | number; roleName: string }>({
            pageNum: 1,
            pageSize: 500,
            status: "0",
          }),
        ])

        const roles = Array.isArray(roleRes?.rows) ? roleRes.rows : []
        dispatch({
          deptTree: deptRes,
          roleOptions: roles.map((item) => ({ label: item.roleName, value: String(item.roleId) })),
        })

        if (!isEdit || !userId) return
        const detail = (await api.getUserDetail({ userId })) as UserDetail
        form.setFieldsValue(mapDetailToForm(detail))
      } finally {
        dispatch({ loading: false })
      }
    }
    void init()
  }, [visible, userId, isEdit, defaultDeptId, form])

  useEffect(() => {
    if (!visible) return
    const deptId = selectedDeptId ? String(selectedDeptId) : ""
    if (!deptId) {
      dispatch({ postOptions: [] })
      return
    }
    let cancelled = false
    const loadPosts = async () => {
      try {
        const postRes = await api.getPostList<{ postId: string | number; postName: string }>({
          pageNum: 1,
          pageSize: 500,
          status: "0",
          deptId,
        })
        if (cancelled) return
        const posts = Array.isArray(postRes?.rows) ? postRes.rows : []
        dispatch({
          postOptions: posts.map((item) => ({ label: item.postName, value: String(item.postId) })),
        })
      } catch {
        if (!cancelled) dispatch({ postOptions: [] })
      }
    }
    void loadPosts()
    return () => {
      cancelled = true
    }
  }, [visible, selectedDeptId])

  const handleSubmit = async () => {
    const validate = await form.validate()
    if (validate !== true) return
    dispatch({ submitting: true })
    try {
      const values = form.getFieldsValue(true) as UserFormValues
      const payload: Record<string, unknown> = {
        ...(isEdit && userId ? { userId } : {}),
        nickName: values.nickName?.trim(),
        deptId: values.deptId ?? "",
        phone: values.phone?.trim(),
        email: values.email?.trim() || undefined,
        account: values.account?.trim(),
        userName: values.account?.trim(),
        sex: values.sex || "男",
        status: values.status ?? "0",
        postId: values.postId ?? "",
        roleIds: (values.roleIds ?? []).map((id) => Number(id)),
        remark: values.remark ?? "",
      }
      if (!isEdit || values.password) {
        payload.password = values.password
      }
      if (isEdit) {
        await api.updateUser(payload)
      } else {
        await api.insertUser(payload)
      }
      showMessage(`${title}成功`, "success")
      onClose(true)
    } finally {
      dispatch({ submitting: false })
    }
  }

  return (
    <BasicDialog
      visible={visible}
      header={title}
      width={760}
      confirmLoading={submitting}
      onClose={() => onClose()}
      onConfirm={() => void handleSubmit()}
    >
      <div className={loading ? "pointer-events-none opacity-60" : undefined}>
        <BasicForm
          form={form}
          formConfig={formConfigWithStrength}
          labelWidth={90}
          gutter={[24, 0]}
          reserveErrorSpace
        />
      </div>
    </BasicDialog>
  )
}
