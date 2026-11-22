import type { ReactNode } from "react"

export interface TabItemProps {
  key: string
  label: ReactNode
  closable?: boolean
  /**
   * @zh 是否可拖拽
   * @en Whether it can be dragged.
   */
  draggable?: boolean
  /**
   * 可选的历史状态值，如 search 和 hash，可存储于此
   * 在目标路由中可通过 useLocation 钩子访问该状态
   * @see {@link https://reactrouter.com/en/main/hooks/use-navigate#optionsstate | usenavigate - options state}
   */
  historyState?: Record<string, unknown>
}

export interface TabStateType extends Omit<TabItemProps, "label"> {
  label: string
  /**
   * @zh 标签页的新标题，用于修改标签页的标题
   * @en The new title of the tab, used to modify the title of the tab.
   */
  newTabTitle?: ReactNode
}

export const TabActionKeys = {
  REFRESH: "refresh",
  CLOSE: "close",
  CLOSE_RIGHT: "closeRight",
  CLOSE_LEFT: "closeLeft",
  CLOSE_OTHERS: "closeOthers",
  CLOSE_ALL: "closeAll",
} as const

export type TabActionKey = (typeof TabActionKeys)[keyof typeof TabActionKeys]

export interface TabMenuItem {
  key: string
  label: string
  disabled?: boolean
}

export interface TabRenderItem extends TabStateType {
  icon?: ReactNode
}
