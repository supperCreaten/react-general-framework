import { usePreferences } from "@/hooks/use-preferences"
import { setSidebarCollapsed } from "@/store/modules/preferences"
import { cn, useAppDispatch } from "@/utils/methods"
import { MenuFoldIcon, MenuUnfoldIcon } from "tdesign-icons-react"
import { Button } from "tdesign-react"

import { siderTriggerHeight } from "../../constants"

interface SiderTriggerProps {
  className?: string
}

/**
 * 侧边栏底部折叠/展开触发器
 */
export function SiderTrigger({ className }: SiderTriggerProps) {
  const { sidebarCollapsed } = usePreferences()
  const dispatch = useAppDispatch()

  return (
    <Button
      variant="text"
      style={{ height: siderTriggerHeight }}
      icon={sidebarCollapsed ? <MenuUnfoldIcon size={18} /> : <MenuFoldIcon size={18} />}
      onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
      aria-label={sidebarCollapsed ? "展开侧边栏" : "折叠侧边栏"}
      className={cn(
        "w-full rounded-none border-0 border-t border-solid border-t-(--td-component-border)",
        className,
      )}
    />
  )
}
