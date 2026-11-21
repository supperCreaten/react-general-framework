import CreateComponent from "@/components/CreateComponent"
import { createIconifyIcon } from "@/icons"

/** 按图标名渲染菜单列表中的 Iconify 图标 */
export function renderMenuIcon(icon?: string) {
  if (!icon) return null
  return CreateComponent(createIconifyIcon(`svg:${icon}`), { width: "1.25em", height: "1.25em" })
}
