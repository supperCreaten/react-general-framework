import React, { useState } from "react"
import { useDeviceType } from "@/hooks/use-device-type"
import { usePreferences } from "@/hooks/use-preferences"
import { useLayout } from "@/hooks/use-layout"
import { cn, useAppDispatch } from "@/utils/methods"
import { setSidebarCollapsed } from "@/store/modules/preferences"
import { headerHeight } from "../constants"
import { Button, Drawer, Space } from "tdesign-react"
import { Setting1Icon } from "tdesign-icons-react"
import PageSetting from "./components/pageSetting"
import UserDropdown from "./components/user-dropdown"

export interface LayoutHeaderProps {
  className?: string
  children?: React.ReactNode
}

export default function LayoutHeader({ className, children }: LayoutHeaderProps) {
  const { sidebarCollapsed, isMenuDark, isDark } = usePreferences()
  const { isMobile } = useDeviceType()
  const { isTopNav } = useLayout()
  const dispatch = useAppDispatch()
  const [visible, setVisible] = useState(false)
  const menuText =
    isMenuDark && !isDark ? "rgba(255, 255, 255, 0.85)" : "var(--td-text-color-primary)"

  return (
    <header
      className={cn(
        "shrink-0 flex gap-5 justify-between items-center transition-[height,padding] md:px-4",
        className,
      )}
      style={
        {
          background: isMenuDark && !isDark ? "#141414" : "var(--td-bg-color-container)",
          height: headerHeight,
          color: menuText,
          ["--app-menu-text" as string]: menuText,
        } as React.CSSProperties
      }
    >
      {isMobile && !isTopNav ? (
        <button
          type="button"
          aria-label={sidebarCollapsed ? "关闭菜单" : "打开菜单"}
          onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
          className="h-full shrink-0 px-3"
        >
          {sidebarCollapsed ? "展开" : "收起"}
        </button>
      ) : null}

      <div className="flex min-w-0 flex-1 items-center h-full overflow-hidden gap-2">{children}</div>
      <Space size="small" align="center" className="shrink-0">
        <Button variant="outline" shape="circle" icon={<Setting1Icon size={16} />} onClick={() => setVisible(true)} />
        <UserDropdown />
      </Space>
      <Drawer
        header="页面设置"
        size="medium"
        footer={<Button theme="primary">自定义底部按钮</Button>}
        visible={visible}
        destroyOnClose
        onClose={() => setVisible(false)}
      >
        <PageSetting />
      </Drawer>
    </header>
  )
}
