import CreateComponent from "@/components/CreateComponent"
import { createIconifyIcon } from "@/icons"

export function renderMenuIcon(icon?: string) {
  if (!icon) return null
  return CreateComponent(createIconifyIcon(`svg:${icon}`), { width: "1.25em", height: "1.25em" })
}
