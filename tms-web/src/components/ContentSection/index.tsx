import type { ContentSectionProps } from "@/interface/components"
import { Card, Loading } from "tdesign-react"
import type { ReactNode } from "react"
import { clsx } from "clsx"
import { findSlot } from ".."

export type { ContentSectionProps }

type SlotProps = { children?: ReactNode }

function ContentSectionHeader({ children }: SlotProps) {
  return <>{children}</>
}
ContentSectionHeader.displayName = "ContentSection.Header"

function ContentSectionContent({ children }: SlotProps) {
  return <>{children}</>
}
ContentSectionContent.displayName = "ContentSection.Content"

function ContentSectionFooter({ children }: SlotProps) {
  return <>{children}</>
}
ContentSectionFooter.displayName = "ContentSection.Footer"

function ContentSection(props: ContentSectionProps) {
  const { isContentFullCard = true, isFull = true, loading = false, children, className } = props
  const header = findSlot(children, "ContentSection.Header")
  const content = findSlot(children, "ContentSection.Content")
  const footer = findSlot(children, "ContentSection.Footer")
  const hasChrome = Boolean(header || footer)

  const scrollClassName = clsx(
    "overflow-x-hidden",
    isFull ? "min-h-0 flex-1 overflow-y-auto" : "overflow-y-visible",
  )

  /** 有 header/footer 时共用一块白底容器，三者贴合不留缝 */
  if (hasChrome) {
    return (
      <Loading loading={loading} showOverlay className={clsx(isFull ? "h-full min-h-0" : undefined)}>
        <div className={clsx("box-border flex flex-col p-2.5", isFull ? "h-full min-h-0" : "h-auto", className)}>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-(--td-radius-medium) bg-td-bg-container">
            {header ? <div className="shrink-0">{header}</div> : null}
            <div className={scrollClassName}>{content}</div>
            {footer ? (
              <div className="flex shrink-0 items-center justify-center gap-3 border-t border-td-border px-4 py-3">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </Loading>
    )
  }

  return (
    <Loading loading={loading} showOverlay className={clsx(isFull ? "h-full min-h-0" : undefined)}>
      <div className={clsx("box-border flex flex-col p-2.5", isFull ? "h-full min-h-0" : "h-auto", className)}>
        {isContentFullCard ? (
          <Card className={scrollClassName} bordered={false}>
            {content}
          </Card>
        ) : (
          <div className={scrollClassName}>{content}</div>
        )}
      </div>
    </Loading>
  )
}

type ContentSectionComponent = typeof ContentSection & {
  Header: typeof ContentSectionHeader
  Content: typeof ContentSectionContent
  Footer: typeof ContentSectionFooter
}

const ContentSectionWithSlots = ContentSection as ContentSectionComponent
ContentSectionWithSlots.Header = ContentSectionHeader
ContentSectionWithSlots.Content = ContentSectionContent
ContentSectionWithSlots.Footer = ContentSectionFooter

export default ContentSectionWithSlots
