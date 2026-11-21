import type { ReactNode } from "react"

export type MenuMode = "horizontal" | "vertical"
export type MenuTheme = "light" | "dark"

export type MenuItemType = {
  key: string
  label?: ReactNode
  icon?: ReactNode
  path: string
  component: string
  /**
   * 菜单类型（与后端 Integer 一致）：0 目录 / 1 菜单 / 2 按钮 / 3 页面。
   * 路由生成据此区分「目录不挂页」与「菜单挂自身页 + 子页面」。
   */
  menuType: number
  level: number
  hidden: boolean
  disabled?: boolean
  meta: {
    title: string
    icon: string
    keepAlive?: boolean | number
  }
  children: MenuItemType[] | undefined
}

/** 递归菜单项所需的最小字段约束 */
export type MenuNode = {
  key: string
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  hidden?: boolean
  children?: MenuNode[]
}

export interface MenuInitialState {
  wholeMenus: MenuItemType[]
  isAccessChecked: boolean
}

/** 鉴权路由菜单（/api/authRoutes 返回） */
export type MenuInfo = {
  path: string
  component: string
  hidden: boolean
  menuId: string
  menuType: number
  meta: {
    title: string
    icon: string
    keepAlive?: boolean | number
  }
  parentId: string | number
  children?: MenuInfo[] | null
}

/** 菜单树节点（懒加载 / 下拉树 / 权限树） */
export type MenuTreeNode = {
  menuId: string | number
  menuName: string
  hasChildren?: boolean
  children?: MenuTreeNode[] | boolean
}

/** 菜单详情 */
export type MenuDetail = {
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

/** 菜单列表/树表行 */
export type MenuRow = {
  menuId: string | number
  menuName: string
  icon?: string
  orderNum?: number
  perms?: string
  menuType?: string | number
  status?: string | number
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  hasChildren?: boolean
  /** 懒加载未展开时用 true 占位（运行时）；类型上兼容 TableRowData */
  children?: MenuRow[] | boolean
}

/** 菜单表单值 */
export type MenuFormValues = {
  parentId?: string | number
  menuType?: number
  icon?: string
  menuName?: string
  orderNum?: number
  isFrame?: string
  path?: string
  perms?: string
  keepAlive?: string
  hidden?: string
  status?: string
}

/** 新增/编辑菜单弹窗 Props */
export type AddMenuProps = {
  visible: boolean
  title: string
  menuId?: string
  onClose: (submitted?: boolean) => void
}

/** 菜单列表页弹窗状态 */
export type MenuDialogState = {
  visible: boolean
  title: string
  menuId?: string
}