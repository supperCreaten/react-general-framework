import type store from "@/store"
import type { MenuItemType } from "@/interface/menu"

export type AppDispatch = typeof store.dispatch

export type { RootState } from "@/store/modules"

export interface MenuInitialState {
  wholeMenus: MenuItemType[]
  isAccessChecked: boolean
}

export interface UserInfoPayload {
  userInfo: Record<string, unknown>
  permissions: string[]
  roles: string[]
}
