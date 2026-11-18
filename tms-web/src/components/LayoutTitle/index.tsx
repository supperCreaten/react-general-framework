import { useState, type ReactNode } from "react"
import { Button } from "tdesign-react"
import { ChevronDownIcon, ChevronUpIcon } from "tdesign-icons-react"
import { cn } from "@/utils/methods"

type LayoutTitleProps = {
  title: string
  children?: ReactNode
  /** 是否显示展开/收起，默认 true */
  collapsible?: boolean
  /** 非受控：默认是否收起 */
  defaultCollapsed?: boolean
  /** 受控：是否收起 */
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** 标题后操作区（紧跟标题，适合放新增等按钮） */
  actions?: ReactNode
  /** 标题栏右侧额外内容（展开/收起左侧） */
  extra?: ReactNode
  className?: string
  contentClassName?: string
}

export default function LayoutTitle(props: LayoutTitleProps) {
  const {
    title,
    children,
    collapsible = true,
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

  const handleToggle = () => {
    const next = !collapsed
    if (controlledCollapsed === undefined) {
      setInnerCollapsed(next)
    }
    onCollapsedChange?.(next)
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-(--td-radius-medium) bg-td-bg-container text-(length:--td-font-size-body-medium) text-td-text",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-td-border px-(--td-comp-paddingLR-xl) py-(--td-comp-paddingTB-l)">
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
        <div
          className={cn(
            "px-(--td-comp-paddingLR-xl) py-(--td-comp-paddingTB-l)",
            collapsed && "hidden",
            contentClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
