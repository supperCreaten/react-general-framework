import { Children, isValidElement, type ReactNode } from "react"
import { Card } from "tdesign-react"
import { clsx } from "clsx"

type SlotProps = { children?: ReactNode }

function createSlot(displayName: string) {
  function Slot({ children }: SlotProps) {
    return <>{children}</>
  }
  Slot.displayName = displayName
  return Slot
}

const TableSectionHeader = createSlot("TableSection.Header")
const TableSectionToolbarLeft = createSlot("TableSection.ToolbarLeft")
const TableSectionToolbarRight = createSlot("TableSection.ToolbarRight")
const TableSectionContent = createSlot("TableSection.Content")
const TableSectionFooter = createSlot("TableSection.Footer")

function getSlotName(node: ReactNode) {
  if (!isValidElement(node)) return undefined
  return (node.type as { displayName?: string }).displayName
}

function getSlotChildren(node: ReactNode) {
  return isValidElement<SlotProps>(node) ? node.props.children : null
}

/** 解析顶层插槽；Toolbar 也可嵌在 Content 内 */
function parseTableSectionSlots(children: ReactNode) {
  let header: ReactNode = null
  let footer: ReactNode = null
  let toolbarLeft: ReactNode = null
  let toolbarRight: ReactNode = null
  const contentNodes: ReactNode[] = []

  for (const child of Children.toArray(children)) {
    switch (getSlotName(child)) {
      case "TableSection.Header":
        header = getSlotChildren(child)
        break
      case "TableSection.Footer":
        footer = getSlotChildren(child)
        break
      case "TableSection.ToolbarLeft":
        toolbarLeft = getSlotChildren(child)
        break
      case "TableSection.ToolbarRight":
        toolbarRight = getSlotChildren(child)
        break
      case "TableSection.Content": {
        for (const node of Children.toArray(getSlotChildren(child))) {
          const name = getSlotName(node)
          if (name === "TableSection.ToolbarLeft") {
            toolbarLeft ??= getSlotChildren(node)
            continue
          }
          if (name === "TableSection.ToolbarRight") {
            toolbarRight ??= getSlotChildren(node)
            continue
          }
          contentNodes.push(node)
        }
        break
      }
      default:
        break
    }
  }

  return { header, footer, toolbarLeft, toolbarRight, content: contentNodes }
}

type TableSectionProps = {
  isContentFullCard?: boolean
  children: ReactNode
  className?: string
}

function TableSection(props: TableSectionProps) {
  const { children, isContentFullCard = true, className } = props
  const { header, footer, toolbarLeft, toolbarRight, content } = parseTableSectionSlots(children)
  const hasToolbar = Boolean(toolbarLeft || toolbarRight)

  const panelClassName = "flex min-h-0 flex-1 flex-col overflow-hidden"
  const bodyClassName = "box-border flex h-full min-h-0 flex-1 flex-col overflow-hidden"

  const body = (
    <>
      {hasToolbar ? (
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">{toolbarLeft}</div>
          <div className="ml-auto flex flex-wrap items-center gap-2">{toolbarRight}</div>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{content}</div>
    </>
  )

  return (
    <div className={clsx("box-border flex h-full min-h-0 flex-col gap-1", className)}>
      {header ? <Card className="shrink-0">{header}</Card> : null}
      {isContentFullCard ? (
        <Card className={panelClassName} bodyClassName={bodyClassName}>
          {body}
        </Card>
      ) : (
        <div className={panelClassName}>{body}</div>
      )}
      {footer ? <Card className="shrink-0">{footer}</Card> : null}
    </div>
  )
}

type TableSectionComponent = typeof TableSection & {
  Header: typeof TableSectionHeader
  ToolbarLeft: typeof TableSectionToolbarLeft
  ToolbarRight: typeof TableSectionToolbarRight
  Content: typeof TableSectionContent
  Footer: typeof TableSectionFooter
}

const TableSectionWithSlots = TableSection as TableSectionComponent
TableSectionWithSlots.Header = TableSectionHeader
TableSectionWithSlots.ToolbarLeft = TableSectionToolbarLeft
TableSectionWithSlots.ToolbarRight = TableSectionToolbarRight
TableSectionWithSlots.Content = TableSectionContent
TableSectionWithSlots.Footer = TableSectionFooter

export default TableSectionWithSlots
export type { TableSectionProps }
