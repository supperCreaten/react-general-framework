import { useEffect, useState, type ComponentProps, type ReactNode } from "react"
import { Tooltip } from "tdesign-react"

type TooltipProps = ComponentProps<typeof Tooltip>

/**
 * Drawer/CSSTransition 过程中直接挂载 TDesign Tooltip/Popup，
 * 可能在组件尚未 mount 完成时异步 setState。
 * 挂载完成后再渲染 Tooltip，避免 React 19 告警。
 */
export function DelayedTooltip({
  children,
  fallback,
  ...tooltipProps
}: TooltipProps & {
  children: ReactNode
  /** 未就绪时的占位（默认直接渲染 children） */
  fallback?: ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(() => {
      if (!cancelled) setReady(true)
    }, 0)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  if (!ready) return <>{fallback ?? children}</>

  return (
    <Tooltip destroyOnClose {...tooltipProps}>
      {children}
    </Tooltip>
  )
}
