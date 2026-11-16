/**
 * 菜单类型（与后端 Integer menuType 一致，勿改成字符串）。
 * - DIRECTORY(0)：仅分组，不挂自身页面路由（如「系统管理」）
 * - MENU(1)：可落地页面，可挂隐藏子页面（如「订单管理」→ `/order`）
 * - BUTTON(2)：按钮权限，一般不进路由树
 * - PAGE(3)：隐藏子页面（如「创建订单」→ `/order/create`）
 */
export const MENU_TYPE = {
  DIRECTORY: 0,
  MENU: 1,
  BUTTON: 2,
  PAGE: 3,
} as const
