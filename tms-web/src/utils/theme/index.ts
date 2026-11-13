/** 将 hex 规范为 #rrggbb（小写） */
export function normalizeHex(input: string, fallback = "#1677ff"): string {
  const raw = (input || "").trim()
  const short = /^#([0-9a-fA-F]{3})$/.exec(raw)
  if (short) {
    const [r, g, b] = short[1].split("")
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  const full = /^#([0-9a-fA-F]{6})$/.exec(raw)
  if (full) return `#${full[1]}`.toLowerCase()
  return fallback
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex).slice(1)
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0")
  return `#${to(r)}${to(g)}${to(b)}`
}

/** 按权重混合两种颜色，weight 越接近 1 越偏 color2 */
function mix(color1: string, color2: string, weight: number): string {
  const w = Math.max(0, Math.min(1, weight))
  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)
  return rgbToHex(r1 * (1 - w) + r2 * w, g1 * (1 - w) + g2 * w, b1 * (1 - w) + b2 * w)
}

/**
 * 浅色模式色板：品牌色落在第 7 级。
 * 深色模式色板：由深到浅，品牌色落在第 8 级（对齐 TDesign dark token）。
 */
export function generateBrandPalette(brandColor: string, isDark = false): string[] {
  const brand = normalizeHex(brandColor)
  if (isDark) {
    const darkSteps = [0.82, 0.7, 0.58, 0.46, 0.34, 0.22, 0.1]
    const lightSteps = [0.22, 0.4]
    return [
      ...darkSteps.map((w) => mix(brand, "#000000", w)),
      brand,
      ...lightSteps.map((w) => mix(brand, "#ffffff", w)),
    ]
  }
  const lightSteps = [0.9, 0.72, 0.54, 0.36, 0.18, 0.06]
  const darkSteps = [0.18, 0.36, 0.54]
  return [
    ...lightSteps.map((w) => mix(brand, "#ffffff", w)),
    brand,
    ...darkSteps.map((w) => mix(brand, "#000000", w)),
  ]
}

/** 切换 TDesign 深/浅色（html[theme-mode]），并同步 Tailwind `.dark` */
export function applyThemeMode(isDark: boolean): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (isDark) {
    root.setAttribute("theme-mode", "dark")
    root.classList.add("dark")
  } else {
    root.removeAttribute("theme-mode")
    root.classList.remove("dark")
  }
}

/** 将主题色写入 document，驱动 TDesign CSS Variables */
export function applyThemeColor(brandColor: string, isDark = false): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const palette = generateBrandPalette(brandColor, isDark)
  palette.forEach((color, index) => {
    root.style.setProperty(`--td-brand-color-${index + 1}`, color)
  })

  if (isDark) {
    root.style.setProperty("--td-brand-color", palette[7])
    root.style.setProperty("--td-brand-color-hover", palette[6])
    root.style.setProperty("--td-brand-color-focus", palette[1])
    root.style.setProperty("--td-brand-color-active", palette[8])
    root.style.setProperty("--td-brand-color-disabled", palette[2])
    root.style.setProperty("--td-brand-color-light", palette[0])
    root.style.setProperty("--td-brand-color-light-hover", palette[1])
    root.style.setProperty("--td-text-color-brand", palette[7])
    root.style.setProperty("--td-text-color-link", palette[7])
    root.style.setProperty("--app-primary", palette[7])
    root.style.setProperty("--app-primary-light", palette[0])
    root.style.setProperty("--app-primary-border", palette[2])
  } else {
    root.style.setProperty("--td-brand-color", palette[6])
    root.style.setProperty("--td-brand-color-hover", palette[5])
    root.style.setProperty("--td-brand-color-focus", palette[1])
    root.style.setProperty("--td-brand-color-active", palette[7])
    root.style.setProperty("--td-brand-color-disabled", palette[2])
    root.style.setProperty("--td-brand-color-light", palette[0])
    root.style.setProperty("--td-brand-color-light-hover", palette[1])
    root.style.setProperty("--td-text-color-brand", palette[6])
    root.style.setProperty("--td-text-color-link", palette[7])
    root.style.setProperty("--app-primary", palette[6])
    root.style.setProperty("--app-primary-light", palette[0])
    root.style.setProperty("--app-primary-border", palette[2])
  }
}

/** 按 themeRadius 同步圆角 token（以 medium 为基准做比例缩放） */
export function applyThemeRadius(radius: number): void {
  if (typeof document === "undefined") return
  const base = Number.isFinite(radius) ? Math.max(0, Math.min(16, radius)) : 6
  const root = document.documentElement
  root.style.setProperty("--td-radius-small", `${Math.round(base * 0.33)}px`)
  root.style.setProperty("--td-radius-default", `${Math.round(base * 0.5)}px`)
  root.style.setProperty("--td-radius-medium", `${base}px`)
  root.style.setProperty("--td-radius-large", `${Math.round(base * 1.5)}px`)
  root.style.setProperty("--td-radius-extraLarge", `${Math.round(base * 2)}px`)
}

export function applyTheme(options: { color?: string; radius?: number; isDark?: boolean }): void {
  if (typeof options.isDark === "boolean") applyThemeMode(options.isDark)
  if (options.color) applyThemeColor(options.color, Boolean(options.isDark))
  if (typeof options.radius === "number") applyThemeRadius(options.radius)
}

/** 解析当前是否应使用深色（含跟随系统） */
export function resolveIsDark(themeMode: "light" | "dark" | "system", systemPrefersDark: boolean): boolean {
  if (themeMode === "dark") return true
  if (themeMode === "system") return systemPrefersDark
  return false
}
