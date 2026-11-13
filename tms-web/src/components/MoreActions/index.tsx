import { useMemo, type ReactNode } from "react"
import { Button, Dropdown, type ButtonProps, type DropdownProps } from "tdesign-react"
import { ChevronDownIcon } from "tdesign-icons-react"
import { clsx } from "clsx"

export type MoreActionItem = {
  key: string | number
  label: ReactNode
  disabled?: boolean
  divider?: boolean
  /** 下拉项主题；danger 会映射为 error */
  theme?: "default" | "success" | "warning" | "error" | "danger"
  prefixIcon?: ReactNode
  /** 为 false 时不渲染 */
  visible?: boolean
  onClick?: () => void
}

export type MoreActionsProps = {
  /** 操作项 */
  items: MoreActionItem[]
  /**
   * 直接展示的按钮数量，超出部分收入「更多」
   * - 默认 1：外侧保留 1 个文字按钮
   * - 传 0：全部收入「更多」
   * - 传 N：前 N 个为文字按钮，其余进「更多」
   */
  maxVisible?: number
  moreText?: string
  /** 「更多」触发按钮样式（默认 primary text，贴合表格操作列） */
  moreButtonProps?: Omit<ButtonProps, "children" | "suffix" | "onClick">
  /** 外侧直接展示的文字按钮样式 */
  actionButtonProps?: Omit<ButtonProps, "children" | "onClick" | "theme" | "disabled">
  className?: string
  dropdownProps?: Omit<DropdownProps, "options" | "onClick" | "children">
}

function mapDropdownTheme(
  theme?: MoreActionItem["theme"],
): "default" | "success" | "warning" | "error" | undefined {
  if (!theme || theme === "default") return "default"
  if (theme === "danger") return "error"
  return theme
}

function toButtonTheme(theme?: MoreActionItem["theme"]): ButtonProps["theme"] {
  if (theme === "danger" || theme === "error") return "danger"
  if (theme === "warning") return "warning"
  if (theme === "success") return "success"
  return "primary"
}

export default function MoreActions(props: MoreActionsProps) {
  const {
    items,
    maxVisible = 1,
    moreText = "更多",
    moreButtonProps,
    actionButtonProps,
    className,
    dropdownProps,
  } = props

  const visibleItems = useMemo(
    () => items.filter((item) => item.visible !== false),
    [items],
  )

  const { inlineItems, moreItems } = useMemo(() => {
    const limit = Number.isFinite(maxVisible) ? Math.max(0, maxVisible) : visibleItems.length
    if (limit >= visibleItems.length) {
      return { inlineItems: visibleItems, moreItems: [] as MoreActionItem[] }
    }
    return {
      inlineItems: visibleItems.slice(0, limit),
      moreItems: visibleItems.slice(limit),
    }
  }, [maxVisible, visibleItems])

  const options = useMemo<NonNullable<DropdownProps["options"]>>(
    () =>
      moreItems.map((item) => ({
        content: item.label,
        value: item.key,
        disabled: item.disabled,
        divider: item.divider,
        theme: mapDropdownTheme(item.theme),
        ...(item.prefixIcon ? { prefixIcon: item.prefixIcon as never } : {}),
      })),
    [moreItems],
  )

  const handleDropdownClick: DropdownProps["onClick"] = (dropdownItem) => {
    const target = moreItems.find((item) => item.key === dropdownItem.value)
    target?.onClick?.()
  }

  if (!visibleItems.length) return null

  return (
    <div className={clsx("inline-flex flex-wrap items-center justify-center gap-1", className)}>
      {inlineItems.map((item) => (
        <Button
          key={item.key}
          theme={toButtonTheme(item.theme)}
          variant="text"
          disabled={item.disabled}
          {...actionButtonProps}
          onClick={() => item.onClick?.()}
        >
          {item.label}
        </Button>
      ))}

      {moreItems.length > 0 && (
        <Dropdown
          trigger="click"
          placement="bottom-left"
          minColumnWidth={96}
          {...dropdownProps}
          options={options}
          onClick={handleDropdownClick}
        >
          <Button theme="primary" variant="text" {...moreButtonProps}>
            <span className="inline-flex items-center gap-0.5">
              {moreText}
              <ChevronDownIcon size={14} />
            </span>
          </Button>
        </Dropdown>
      )}
    </div>
  )
}
