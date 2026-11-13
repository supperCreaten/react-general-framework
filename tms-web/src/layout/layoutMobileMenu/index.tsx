import { Scrollbar } from "@/components/Scrollbar"
import { useDeviceType } from "@/hooks/use-device-type"
import { usePreferences } from "@/hooks/use-preferences"
import { useAppDispatch } from "@/utils/methods"
import { useCallback } from "react"

import LayoutMenu from "../LayoutMenu"
import useMenu from "@/hooks/use-menu"
import { setSidebarCollapsed } from "@/store/modules/preferences"
import { Drawer } from "tdesign-react"

export default function LayoutMobileMenu() {
  const { sidebarCollapsed } = usePreferences()
  const { isMobile } = useDeviceType()
  const { sideNavItems, handleMenuSelect } = useMenu()
  const dispatch = useAppDispatch()

  const handleMobileMenuSelect = useCallback(
    (key: string, mode: "vertical" | "horizontal") => {
      handleMenuSelect(key, mode)
      dispatch(setSidebarCollapsed(false))
    },
    [dispatch, handleMenuSelect],
  )

  return isMobile ? (
    <Drawer
      visible={sidebarCollapsed}
      placement="left"
      cancelBtn={false}
      confirmBtn={false}
      onClose={() => dispatch(setSidebarCollapsed(false))}
      children={
        <Scrollbar>
          <LayoutMenu autoExpandCurrentMenu menus={sideNavItems} handleMenuSelect={handleMobileMenuSelect} />
        </Scrollbar>
      }
    ></Drawer>
  ) : null
}
