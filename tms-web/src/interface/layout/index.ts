import type { MenuItemType, MenuMode, MenuNode } from "@/interface/menu"
import type { ReactNode } from "react"

export interface LayoutHeaderProps {
  className?: string
  children?: ReactNode
}

export interface LayoutSidebarProps {
  children?: ReactNode
  computedSidebarWidth: number
}

export interface UseSidebarResizeOptions {
  /** 当前侧栏展开宽度 */
  sidebarWidth: number
  /** 折叠时不可拖拽 */
  disabled?: boolean
  minWidth?: number
  maxWidth?: number
}

export interface LayoutMixedSidebarProps {
  computedSidebarWidth?: number
  topNavItems?: MenuItemType[]
  sideNavItems?: MenuItemType[]
  sideNavMenuKeyInSplitMode?: string
  handleMenuSelect?: (key: string, mode: MenuMode) => void
}

export interface FirstColumnMenuProps {
  menus?: MenuItemType[]
  sideNavMenuKeyInSplitMode?: string
  handleMenuSelect?: (key: string, mode: MenuMode) => void
}

export interface SiderTriggerProps {
  className?: string
}

export interface LogoProps {
  sidebarCollapsed: boolean
  className?: string
}

export interface LayoutMenuItemProps<T extends MenuNode = MenuItemType> {
  menus?: T[] | null
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