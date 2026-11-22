import type { ReactElement } from "react"
import { Menu } from "tdesign-react"
import type { LayoutMenuItemProps, MenuItemType, MenuNode } from "@/interface"

const { MenuItem, SubMenu } = Menu
const emptyMenus: MenuNode[] = []

function LayoutMenuItem<T extends MenuNode = MenuItemType>({
  menus = emptyMenus as T[],
  activeValue,
  onItemClick,
}: LayoutMenuItemProps<T>) {
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
              onClick={() => {
                // onChange 在 value 未变时不触发；子路由下父菜单已激活再点需靠 onClick 回列表
                if (activeValue != null && String(key) === String(activeValue)) {
                  onItemClick?.(String(key))
                }
              }}
            />
          )
        }

        return (
          <SubMenu key={key} value={key} title={label} icon={icon}>
            <LayoutMenuItem menus={children} activeValue={activeValue} onItemClick={onItemClick} />
          </SubMenu>
        )
      })}
    </>
  )
}

export default LayoutMenuItem
