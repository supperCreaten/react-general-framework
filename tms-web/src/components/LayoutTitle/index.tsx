import type { LayoutTitleProps } from "@/interface/components"
import { useMemo, useState } from "react"
import { Button, Card } from "tdesign-react"
import { ChevronDownIcon, ChevronUpIcon } from "tdesign-icons-react"
import { cn } from "@/utils/methods"

export type { LayoutTitleProps }

export default function LayoutTitle(props: LayoutTitleProps) {
  const {
    title,
    children,
    collapsible = true,
    bordered = false,
    isbodyPPadding = "all",
    defaultCollapsed = false,
    collapsed: controlledCollapsed,
    onCollapsedChange,
    actions,
    extra,
    className,
    contentClassName,
  } = props

  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed)
  const collapsed = controlledCollapsed ?? innerCollapsed
  const bodyClassName = useMemo(() => {
    if (isbodyPPadding === "all") return
    if (isbodyPPadding === "vertical") return "px-0"
    if (isbodyPPadding === "horizontal") return "py-0"
    return "p-0"
  }, [isbodyPPadding])
  const handleToggle = () => {
    const next = !collapsed
    if (controlledCollapsed === undefined) {
      setInnerCollapsed(next)
    }
    onCollapsedChange?.(next)
  }

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-(--td-radius-medium) bg-td-bg-container text-(length:--td-font-size-body-medium) text-td-text",
        className,
      )}
      bordered={bordered}
      bodyClassName={cn(bodyClassName)}
    >
      <div
        className={cn("flex items-center justify-between gap-3 px-(--td-comp-paddingLR-xl) py-(--td-comp-paddingTB-l)")}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-4 w-0.75 shrink-0 rounded-sm bg-td-brand" aria-hidden />
          <span className="truncate font-(--td-font-title-medium) text-td-text">{title}</span>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {extra}
          {collapsible ? (
            <Button
              theme="primary"
              variant="text"
              suffix={collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
              onClick={handleToggle}
            >
              {collapsed ? "展开" : "收起"}
            </Button>
          ) : null}
        </div>
      </div>

      {children ? (
        <div className={cn("py-(--td-comp-paddingTB-l)", collapsed && "hidden", contentClassName)}>{children}</div>
      ) : null}
    </Card>
  )
}
