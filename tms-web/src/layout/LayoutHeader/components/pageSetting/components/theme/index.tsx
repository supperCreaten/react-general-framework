import type { ThemeMode } from "@/interface"
import type { RootState } from "@/store"
import { setPreferences } from "@/store/modules/preferences"
import { cn, useAppDispatch } from "@/utils/methods"
import { normalizeHex } from "@/utils/theme"
import { ColorPickerPanel, Divider, Popup, Slider, Tooltip } from "tdesign-react"
import { startTransition, useMemo, type ReactNode } from "react"
import { useSelector } from "react-redux"
import { THEME_MODE_PRESETS, THEME_PRESET_COLORS, THEME_PRESETS } from "./constants"

const MODE_ICON_CLASS = "h-8 w-8 text-td-text"
const SWATCH_CLASS = "h-8 w-8 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0_/_0.08)]"

function ThemeCardShell({
  active,
  label,
  tip,
  onClick,
  children,
}: {
  active: boolean
  label: string
  tip?: string
  onClick?: () => void
  children: ReactNode
}) {
  const card = (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="w-full cursor-pointer border-0 bg-transparent p-0 text-left"
    >
      <div
        className={cn(
          "box-border flex h-18 items-center justify-center rounded-lg border-2 border-solid bg-td-bg-container transition-colors",
          active ? "border-td-brand" : "border-td-border hover:border-td-border-strong",
        )}
      >
        {children}
      </div>
      <div className="mt-2.5 truncate text-center text-xs leading-none text-td-text">{label}</div>
    </button>
  )

  if (!tip) return card
  return <Tooltip content={tip}>{card}</Tooltip>
}

export default function ThemeSetting() {
  const dispatch = useAppDispatch()
  const { themeMode, themeColorPrimary, themeRadius } = useSelector((state: RootState) => state.preferences)

  const currentColor = useMemo(() => normalizeHex(themeColorPrimary), [themeColorPrimary])
  const isPreset = THEME_PRESET_COLORS.some((c) => normalizeHex(c) === currentColor)

  function setThemeMode(mode: ThemeMode) {
    startTransition(() => {
      dispatch(setPreferences({ themeMode: mode }))
    })
  }

  function setThemeColor(color: string) {
    const next = normalizeHex(color)
    startTransition(() => {
      dispatch(setPreferences({ themeColorPrimary: next }))
    })
  }

  function setThemeRadius(value: number) {
    startTransition(() => {
      dispatch(setPreferences({ themeRadius: value }))
    })
  }

  return (
    <>
      <Divider align="center" style={{ marginTop: 16, marginBottom: 16 }}>
        主题
      </Divider>

      <ul className="m-0 grid w-full list-none grid-cols-3 gap-3 p-0">
        {THEME_MODE_PRESETS.map((item) => {
          const active = item.mode === themeMode
          const Preview = item.Icon
          return (
            <li key={item.mode} className="min-w-0">
              <ThemeCardShell active={active} label={item.name} onClick={() => setThemeMode(item.mode)}>
                <Preview className={MODE_ICON_CLASS} />
              </ThemeCardShell>
            </li>
          )
        })}
      </ul>

      <Divider align="center" style={{ marginTop: 20, marginBottom: 16 }}>
        内置主题
      </Divider>

      <ul className="m-0 grid w-full list-none grid-cols-3 gap-3 p-0">
        {THEME_PRESETS.map((item) => {
          const active = normalizeHex(item.color) === currentColor
          return (
            <li key={item.color} className="min-w-0">
              <ThemeCardShell
                active={active}
                label={item.name}
                tip={item.tip}
                onClick={() => setThemeColor(item.color)}
              >
                <span className={SWATCH_CLASS} style={{ backgroundColor: item.color }} />
              </ThemeCardShell>
            </li>
          )
        })}

        <li className="min-w-0">
          <Popup
            trigger="click"
            placement="bottom-left"
            destroyOnClose
            content={
              <ColorPickerPanel
                value={currentColor}
                format="HEX"
                recentColors={null}
                swatchColors={[...THEME_PRESET_COLORS]}
                colorModes={["monochrome"]}
                onChange={(value) => setThemeColor(value)}
              />
            }
          >
            <div>
              <ThemeCardShell
                active={!isPreset}
                label="自定义"
                tip={isPreset ? "自定义主题色" : `当前 ${currentColor}`}
              >
                <span
                  className={SWATCH_CLASS}
                  style={{
                    background: isPreset
                      ? "conic-gradient(from 180deg at 50% 50%, #f5222d 0deg, #fa8c16 60deg, #52c41a 120deg, #13c2c2 180deg, #1677ff 240deg, #722ed1 300deg, #f5222d 360deg)"
                      : currentColor,
                  }}
                />
              </ThemeCardShell>
            </div>
          </Popup>
        </li>
      </ul>

      <div className="mt-5 mb-2 flex items-center justify-between text-xs leading-5 text-td-text-secondary">
        <span>圆角</span>
        <span className="tabular-nums text-td-text-placeholder">{themeRadius}px</span>
      </div>
      <Slider min={0} max={16} step={1} value={themeRadius} onChange={(value) => setThemeRadius(Number(value))} />
    </>
  )
}
