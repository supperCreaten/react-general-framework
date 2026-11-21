import { MENU_TYPE } from "@/constants/menu"

export const MENU_TYPE_OPTIONS = [
  { label: "目录", value: MENU_TYPE.DIRECTORY },
  { label: "菜单", value: MENU_TYPE.MENU },
  { label: "按钮", value: MENU_TYPE.BUTTON },
  { label: "页面", value: MENU_TYPE.PAGE },
]

export const MENU_TYPE_LABEL: Record<string, string> = {
  [MENU_TYPE.DIRECTORY]: "目录",
  [MENU_TYPE.MENU]: "菜单",
  [MENU_TYPE.BUTTON]: "按钮",
  [MENU_TYPE.PAGE]: "页面",
}

/** 是否外链：0=是 1=否 */
export const FRAME_OPTIONS = [
  { label: "是", value: "0" },
  { label: "否", value: "1" },
]

export const VISIBLE_OPTIONS = [
  { label: "显示", value: "0" },
  { label: "隐藏", value: "1" },
]

export const STATUS_OPTIONS = [
  { label: "正常", value: "0" },
  { label: "停用", value: "1" },
]

/** 表单 keepAlive：1=缓存 0=不缓存（对应后端 isCache 0/1 反向） */
export const KEEP_ALIVE_OPTIONS = [
  { label: "缓存", value: "1" },
  { label: "不缓存", value: "0" },
]

/** 目录/菜单类型是否展示图标字段 */
export function shouldShowIcon(menuType?: number) {
  return menuType === MENU_TYPE.DIRECTORY || menuType === MENU_TYPE.MENU
}

/** 非按钮类型是否展示路由相关字段 */
export function shouldShowRouteFields(menuType?: number) {
  return menuType !== MENU_TYPE.BUTTON
}

/** 菜单/页面类型是否展示缓存等详情字段 */
export function shouldShowMenuDetailFields(menuType?: number) {
  return menuType === MENU_TYPE.MENU || menuType === MENU_TYPE.PAGE
}

/** 菜单类型是否展示是否外链字段 */
export function shouldShowFrameFields(menuType?: number) {
  return menuType === MENU_TYPE.MENU
}

/** keepAlive(1缓存) → isCache('0'缓存) */
export function keepAliveToIsCache(keepAlive?: string) {
  return keepAlive === "1" ? "0" : "1"
}

/** isCache('0'缓存) → keepAlive('1'缓存) */
export function isCacheToKeepAlive(isCache?: string | number) {
  return isCache == null || isCache === "0" || isCache === 0 ? "1" : "0"
}
