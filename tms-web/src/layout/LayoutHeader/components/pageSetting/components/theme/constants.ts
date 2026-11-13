import type { ThemeMode } from "@/interface"
import { MoonIcon, SunnyIcon, SystemThemeIcon } from "@/icons/local-icons"
import type { ComponentType, SVGProps } from "react"

export interface ThemeModePreset {
  name: string
  mode: ThemeMode
  Icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>
}

/** 外观主题：浅色 / 深色 / 跟随系统 */
export const THEME_MODE_PRESETS: readonly ThemeModePreset[] = [
  { name: "浅色", mode: "light", Icon: SunnyIcon },
  { name: "深色", mode: "dark", Icon: MoonIcon },
  { name: "跟随系统", mode: "system", Icon: SystemThemeIcon },
] as const

export interface ThemeColorPreset {
  name: string
  color: string
  tip: string
}

/**
 * 内置主题色：蓝 / 青 / 绿 / 橙 / 红 / 紫等色相，饱和度适中，适合后台管理系统。
 * 默认与 preferences.themeColorPrimary 初始值（拂晓蓝）一致。
 */
export const THEME_PRESETS: readonly ThemeColorPreset[] = [
  { name: "拂晓蓝", color: "#1677ff", tip: "默认主题，清晰稳重" },
  { name: "极客蓝", color: "#2f54eb", tip: "偏深的科技蓝" },
  { name: "海蓝", color: "#0284c8", tip: "天空海运感" },
  { name: "明青", color: "#13c2c2", tip: "清爽青绿，物流常用" },
  { name: "苍翠绿", color: "#059669", tip: "自然稳妥" },
  { name: "日暮橙", color: "#fa8c16", tip: "温暖醒目" },
  { name: "火山红", color: "#f5222d", tip: "强调警示感" },
  { name: "酱紫", color: "#722ed1", tip: "沉稳高级" },
] as const

export const THEME_PRESET_COLORS = THEME_PRESETS.map((item) => item.color)
