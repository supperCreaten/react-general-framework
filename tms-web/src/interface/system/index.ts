import type { TablePageResult } from "@/interface/common"

/** 用户详情 */
export interface UserDetail {
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

/** 头像上传结果 */
export interface UserAvatarResult {
  imgUrl?: string
  url?: string
}

/** 角色详情 */
export interface RoleDetail {
  roleCode?: string
  roleKey?: string
  roleName?: string
  status?: string | number
  roleSort?: number
  orderNum?: number
  remark?: string
}

/** 角色已勾选菜单 */
export interface RoleMenuConfig {
  checkedKeys?: Array<string | number>
}

/** 角色已关联用户（含授权用户列表行） */
export interface RoleUserRow {
  userId: string | number
  userName?: string
  account?: string
  nickName?: string
}

export type RoleUserConfig = TablePageResult<RoleUserRow> | RoleUserRow[]

/** 部门详情 */
export interface DeptDetail {
  parentId?: string | number
  deptName?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string | number
}

/** 岗位详情 */
export interface PostDetail {
  postName?: string
  postCode?: string
  deptId?: string | number
  postSort?: number
  status?: string | number
  remark?: string
}

/** 菜单详情 */
export interface MenuDetail {
  parentId?: string | number
  menuType?: number
  icon?: string
  menuName?: string
  orderNum?: number
  path?: string
  perms?: string
  isFrame?: string | number
  visible?: string | number
  hidden?: string | number
  status?: string | number
  isCache?: string | number
  keepAlive?: string | number
}

/** 字典详情 */
export type DictDetail = Record<string, unknown>

/** 字典项（按编码查询） */
export interface DictItem {
  dictLabel?: string
  dictValue?: string
  id?: string | number
  dictId?: string | number
}

/** 登录日志详情 */
export type LoginLogDetail = Record<string, unknown>

/** 操作日志详情 */
export type OperLogDetail = Record<string, unknown>

/** 用户画像详情 */
export type UserProfileDetail = Record<string, unknown>

/** 库房详情 */
export type HouseDetail = Record<string, unknown>

/** 统一部门树节点 */
export interface DeptTreeNode {
  deptId: string
  deptName: string
  hasChildren?: boolean
  children?: DeptTreeNode[] | boolean
}

/** 统一菜单树节点 */
export interface MenuTreeNode {
  menuId: string | number
  menuName: string
  parentId?: string | number
  children?: MenuTreeNode[] | boolean
  [key: string]: unknown
}

/** 用户列表行 */
export interface UserRow {
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

export interface UserDialogState {
  visible: boolean
  title: string
  userId?: string
  defaultDeptId?: string
}

export interface UserAuthDialogState {
  visible: boolean
  userId?: string
  userName?: string
}

export interface ResetPwdDialogState {
  visible: boolean
  userId?: string
  userName?: string
  account?: string
}

export interface UserPageState {
  deptKeyword: string
  deptTree: DeptTreeNode[]
  selectedDeptId?: string
  selectedKeys: Array<string | number>
  userDialog: UserDialogState
  authDialog: UserAuthDialogState
  resetPwdDialog: ResetPwdDialogState
}

export interface OptionItem {
  label: string
  value: string | number
}

export interface UserFormValues {
  nickName?: string
  deptId?: string | number
  phone?: string
  email?: string
  account?: string
  sex?: string
  status?: string | number
  postId?: string | number
  roleIds?: Array<string | number>
  remark?: string
  password?: string
}

export interface AddUserState {
  loading: boolean
  deptTree: DeptTreeNode[]
  postOptions: OptionItem[]
  roleOptions: OptionItem[]
}

export interface AddUserProps {
  visible: boolean
  title: string
  userId?: string
  defaultDeptId?: string
  onClose: (changed?: boolean) => void
}

export interface RoleOption {
  roleId: string | number
  roleName?: string
  roleKey?: string
}

export interface AuthRoleProps {
  visible: boolean
  userId?: string
  userName?: string
  onClose: (changed?: boolean) => void
}

export interface AuthRoleState {
  loading: boolean
  roleIds: Array<string | number>
  roleOptions: RoleOption[]
}

export interface ResetPwdFormValues {
  password?: string
  confirmPassword?: string
}

export interface ResetPwdProps {
  visible: boolean
  userId?: string
  userName?: string
  account?: string
  onClose: (changed?: boolean) => void
}

export interface DeptRow {
  deptId: string | number
  deptName?: string
  orderNum?: number
  status?: string | number
  createTime?: string
  children?: DeptRow[]
  [key: string]: unknown
}

export interface DeptDialogState {
  visible: boolean
  title: string
  deptId?: string
  parentId?: string
}

export interface DeptFormValues {
  parentId?: string | number
  deptName?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string | number
}

export interface AddDeptProps {
  visible: boolean
  title: string
  deptId?: string
  parentId?: string
  onClose: (changed?: boolean) => void
}

export interface MenuRow {
  menuId: string | number
  menuName?: string
  orderNum?: number
  path?: string
  menuType?: number
  status?: string | number
  icon?: string
  perms?: string
  children?: MenuRow[]
  [key: string]: unknown
}

export interface MenuDialogState {
  visible: boolean
  title: string
  menuId?: string
  parentId?: string
}

export interface MenuFormValues {
  parentId?: string | number
  menuType?: number
  icon?: string
  menuName?: string
  orderNum?: number
  path?: string
  perms?: string
  isFrame?: string
  hidden?: string
  keepAlive?: string
  status?: string
}

export interface AddMenuProps {
  visible: boolean
  title: string
  menuId?: string
  parentId?: string
  onClose: (changed?: boolean) => void
}

export interface PostRow {
  postId: string | number
  postName?: string
  postCode?: string
  deptName?: string
  postSort?: number
  status?: string | number
  createTime?: string
}

export interface PostDialogState {
  visible: boolean
  title: string
  postId?: string
}

export interface PostFormValues {
  postName?: string
  postCode?: string
  deptId?: string | number
  postSort?: number
  status?: string | number
  remark?: string
}

export interface AddPostProps {
  visible: boolean
  title: string
  postId?: string
  onClose: (changed?: boolean) => void
}

export interface RoleRow {
  roleId: string | number
  roleName?: string
  roleKey?: string
  roleSort?: number
  status?: string | number
  createTime?: string
  remark?: string
  [key: string]: unknown
}

export interface RoleDialogState {
  visible: boolean
  title: string
  roleId?: string
}

export interface RoleAuthDialogState {
  visible: boolean
  roleId?: string
  roleName?: string
}

export interface AddRoleProps {
  visible: boolean
  title: string
  roleId?: string
  onClose: (changed?: boolean) => void
}

export interface AddRoleState {
  loading: boolean
  menuTree: MenuTreeNode[]
  checkedKeys: Array<string | number>
}

export interface AuthUserProps {
  visible: boolean
  roleId?: string
  roleName?: string
  onClose: (changed?: boolean) => void
}

/** @deprecated 请使用 RoleUserRow */
export type AuthUserRow = RoleUserRow
