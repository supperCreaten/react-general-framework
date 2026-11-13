import type { PreferencesState } from "@/interface"
import { initialState as DEFAULT_PREFERENCES } from "@/store/modules/preferences"
import { resolveIsDark } from "@/utils/theme"

import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"

function getSystemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

/**
 * 包装用户偏好设置；根据 themeMode 解析深/浅色，侧边栏可独立深色。
 */
export function usePreferences() {
  const preferences = useSelector((state: { preferences: PreferencesState }) => state.preferences)
  const { sidebarTheme, themeMode } = preferences
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    setSystemPrefersDark(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const isDark = resolveIsDark(themeMode, systemPrefersDark)
  const isMenuDark = sidebarTheme === "dark" || isDark
  const menuTheme: "light" | "dark" = isMenuDark ? "dark" : "light"
  const isDefault = useMemo(() => {
    return Object.entries(DEFAULT_PREFERENCES).every(([key, value]) => {
      return preferences[key as keyof typeof preferences] === value
    })
  }, [preferences])

  return {
    ...preferences,
    isDefault,
    isDark,
    isMenuDark,
    menuTheme,
    isLight: !isDark,
  }
}
