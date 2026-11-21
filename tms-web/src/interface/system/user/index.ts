import type { DeptTreeNode } from "../dept"
import type { RoleOption } from "../role"

/** 用户列表行 */
export type UserRow = {
  userId: string | number
  userName?: string
  account?: string
  nickName?: string
  deptName?: string
  postName?: string
  phone?: string
  phonenumber?: string
  status?: string | number
  createTime?: string
}

/** 用户详情 */
export type UserDetail = {
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

/** 当前登录用户信息（userInfo / 个人中心展示字段） */
export type LoginUserInfo = {
  userId?: string | number
  userName?: string
  account?: string
  nickName?: string
  phonenumber?: string
  phone?: string
  email?: string
  sex?: string
  avatar?: string
  deptName?: string
  roleName?: string
  createTime?: string
  loginDate?: string
  [key: string]: unknown
}

/** 若依用户信息接口响应 */
export type UserInfoApiRes = {
  permissions?: string[]
  roles?: string[]
  user?: LoginUserInfo
}

/** 规范化后的用户信息载荷（store 使用） */
export type UserInfoPayload = {
  userInfo: LoginUserInfo
  permissions: string[]
  roles: string[]
}

/** 角色分配场景下的用户行 */
export type AuthUserRow = {
  userId: string | number
  userName?: string
  account?: string
  nickName?: string
}

/** 下拉选项 */
export type OptionItem = { label: string; value: string }

/** 用户表单值 */
export type UserFormValues = {
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

/** 新增/编辑用户弹窗内部状态 */
export type AddUserState = {
  loading: boolean
  submitting: boolean
  deptTree: DeptTreeNode[]
  postOptions: OptionItem[]
  roleOptions: OptionItem[]
}

/** 新增/编辑用户弹窗 Props */
export type AddUserProps = {
  visible: boolean
  title: string
  userId?: string
  defaultDeptId?: string
  onClose: (submitted?: boolean) => void
}

/** 用户授权角色弹窗 Props */
export type AuthRoleProps = {
  visible: boolean
  userId?: string
  userName?: string
  onClose: (submitted?: boolean) => void
}

/** 用户授权角色弹窗内部状态 */
export type AuthRoleState = {
  loading: boolean
  submitting: boolean
  options: RoleOption[]
  checked: string[]
}

/** 重置密码表单值 */
export type ResetPwdFormValues = {
  password?: string
  confirmPassword?: string
}

/** 重置密码弹窗 Props */
export type ResetPwdProps = {
  visible: boolean
  userId?: string
  userName?: string
  account?: string
  onClose: (submitted?: boolean) => void
}

/** 用户列表页：编辑用户弹窗状态 */
export type UserDialogState = {
  visible: boolean
  title: string
  userId?: string
  defaultDeptId?: string
}

/** 用户列表页：授权角色弹窗状态 */
export type UserAuthDialogState = {
  visible: boolean
  userId?: string
  userName?: string
}

/** 用户列表页：重置密码弹窗状态 */
export type ResetPwdDialogState = {
  visible: boolean
  userId?: string
  userName?: string
  account?: string
}

/** 用户列表页整体状态 */
export type UserPageState = {
  deptKeyword: string
  deptTree: DeptTreeNode[]
  selectedDeptId?: string
  selectedKeys: Array<string | number>
  userDialog: UserDialogState
  authDialog: UserAuthDialogState
  resetPwdDialog: ResetPwdDialogState
}