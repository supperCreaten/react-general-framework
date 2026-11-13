import type { RootState } from "@/store"
import { applyTheme, resolveIsDark } from "@/utils/theme"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

function getSystemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

/** 将 preferences 中的主题模式 / 主题色 / 圆角同步到 document */
export function useTheme() {
  const themeMode = useSelector((s: RootState) => s.preferences.themeMode)
  const themeColorPrimary = useSelector((s: RootState) => s.preferences.themeColorPrimary)
  const themeRadius = useSelector((s: RootState) => s.preferences.themeRadius)
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    setSystemPrefersDark(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const isDark = resolveIsDark(themeMode, systemPrefersDark)
    applyTheme({ color: themeColorPrimary, radius: themeRadius, isDark })
  }, [themeMode, themeColorPrimary, themeRadius, systemPrefersDark])
}
