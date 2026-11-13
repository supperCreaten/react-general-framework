import type { ReactElement } from "react"
import { Menu } from "tdesign-react"
import type { LayoutMenuItemProps, MenuItemType, MenuNode } from "@/interface"
const { MenuItem, SubMenu } = Menu
const emptyMenus: MenuNode[] = []
function LayoutMenuItem<T extends MenuNode = MenuItemType>({ menus = emptyMenus as T[] }: LayoutMenuItemProps<T>) {
  if (!menus?.length) return null
  return (
    <>
      {menus.map((menu) => {
        if (menu.hidden) return null
        const { key, label, icon, disabled, children } = menu
        if (!children?.length) {
          return (
            <MenuItem
              key={key}
              value={key}
              content={label}
              icon={icon as ReactElement | undefined}
              disabled={disabled}
            />
          )
        }

        return (
          <SubMenu key={key} value={key} title={label} icon={icon}>
            <LayoutMenuItem menus={children} />
          </SubMenu>
        )
      })}
    </>
  )
}

export default LayoutMenuItem
