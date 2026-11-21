import type { MenuTreeNode } from "@/interface/menu"
import type { AuthUserRow } from "../user"

/** 角色列表行 */
export type RoleRow = {
  roleId: string | number
  roleCode: string
  roleKey: string
  roleName: string
  status: string | number
  userCount?: number
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
}

/** 角色详情 */
export type RoleDetail = {
  roleCode?: string
  roleKey?: string
  roleName?: string
  status?: string | number
  roleSort?: number
  orderNum?: number
  remark?: string
}

/** 角色下拉/授权选项 */
export type RoleOption = {
  roleId: string | number
  roleName: string
  roleKey?: string
}

/** 角色已配置菜单权限响应 */
export type RoleMenuConfig = {
  checkedKeys?: Array<string | number>
  menus?: unknown
}

/** 角色已关联用户分页响应 */
export type RoleUserConfig = {
  rows?: AuthUserRow[]
  total?: number
}

/** 角色表单值 */
export type RoleFormValues = {
  roleCode?: string
  roleKey?: string
  roleName?: string
  status?: boolean
  roleSort?: number
  remark?: string
}

/** 新增/编辑角色弹窗 Props */
export type AddRoleProps = {
  visible: boolean
  title: string
  roleId?: string
  onClose: (submitted?: boolean) => void
}

/** 新增/编辑角色弹窗内部状态 */
export type AddRoleState = {
  treeData: MenuTreeNode[]
  selectedMenuKeys: Array<string | number>
  treeLoading: boolean
  loading: boolean
  submitting: boolean
}

/** 角色分配用户弹窗 Props */
export type AuthUserProps = {
  visible: boolean
  roleId?: string
  roleName?: string
  onClose: () => void
}

/** 角色列表页：编辑角色弹窗状态 */
export type RoleDialogState = {
  visible: boolean
  title: string
  roleId?: string
}

/** 角色列表页：分配用户弹窗状态 */
export type RoleAuthDialogState = {
  visible: boolean
  roleId?: string
  roleName?: string
}