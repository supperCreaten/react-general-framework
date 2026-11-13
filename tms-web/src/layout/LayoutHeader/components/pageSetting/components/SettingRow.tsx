import { Icon } from "@iconify/react"
import type { ReactNode } from "react"
import { DelayedTooltip } from "@/components/DelayedTooltip"

function TipIcon({ tip }: { tip: string }) {
  const trigger = (
    <span
      className="inline-flex cursor-help items-center text-td-text-placeholder hover:text-td-text-secondary"
      onClick={(e) => e.stopPropagation()}
    >
      <Icon icon="ri:question-line" width={13} height={13} />
    </span>
  )

  return (
    <DelayedTooltip content={tip} placement="top" fallback={trigger}>
      {trigger}
    </DelayedTooltip>
  )
}

export function SettingRow({
  label,
  tip,
  children,
}: {
  label: string
  tip?: string
  children: ReactNode
}) {
  return (
    <div className="mb-4 flex min-h-8 items-center justify-between gap-3 last:mb-0">
      <div className="flex shrink-0 items-center gap-1 text-sm text-td-text">
        <span>{label}</span>
        {tip ? <TipIcon tip={tip} /> : null}
      </div>
      <div className="min-w-0 max-w-[60%] flex justify-end">{children}</div>
    </div>
  )
}
