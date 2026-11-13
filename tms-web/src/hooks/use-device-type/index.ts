import { useEffect, useState } from "react"

const BREAKPOINTS = {
  sm: 576,
  md: 768,
  xl: 1200,
} as const

function getDeviceType(width: number) {
  const isMobile = width < BREAKPOINTS.md
  const isIpad = width >= BREAKPOINTS.md && width < BREAKPOINTS.xl
  const isPC = width >= BREAKPOINTS.xl
  return { isMobile, isIpad, isPC }
}

/**
 * 判断当前设备类型（移动设备、iPad、PC 等）
 */
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState(() =>
    getDeviceType(typeof window === "undefined" ? BREAKPOINTS.xl : window.innerWidth),
  )

  useEffect(() => {
    const onResize = () => setDeviceType(getDeviceType(window.innerWidth))
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return deviceType
}
