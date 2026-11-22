import type { ReactNode } from "react"

export type MenuMode = "horizontal" | "vertical"
export type MenuTheme = "light" | "dark"

export interface MenuInfo {
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

export interface MenuItemType {
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
export interface MenuNode {
  key: string
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  hidden?: boolean
  children?: MenuNode[]
}

export interface LayoutMenuItemProps<T extends MenuNode = MenuItemType> {
  menus?: T[] | null
  /** 当前激活菜单 value；用于已激活项再次点击时仍能触发导航 */
  activeValue?: string
  /** 菜单项点击（含已激活再点） */
  onItemClick?: (key: string) => void
}

export interface LayoutMenuProps {
  mode?: MenuMode
  /**
   * 控制是否自动展开当前路由对应的菜单项
   *
   * Why?
   * 注意：当菜单模式为顶部导航模式，菜单 mode 为 horizontal，初次进入页面时，菜单不应自动展开，可以指定 autoExpandCurrentMenu 为 false 关闭自动展开功能
   * @see https://github.com/user-attachments/assets/705ae01d-db7f-4f42-b4dd-66adba0dd68f
   */
  autoExpandCurrentMenu?: boolean
  menus?: MenuItemType[]
  wholeMenus?: MenuItemType[]
  handleMenuSelect?: (key: string, mode: MenuMode) => void
}
