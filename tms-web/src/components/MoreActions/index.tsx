import { useMemo, type ReactNode } from "react"
import { Button, Dropdown } from "tdesign-react"
import { ChevronDownIcon } from "tdesign-icons-react"
import { clsx } from "clsx"

import type { MoreActionItem, MoreActionsProps } from "@/interface/components"

export type { MoreActionItem, MoreActionsProps }

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
    <div className={clsx("inline-flex flex-nowrap items-center justify-center gap-1 whitespace-nowrap", className)}>
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
