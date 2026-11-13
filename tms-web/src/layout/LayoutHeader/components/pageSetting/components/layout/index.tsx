import {
  MixedNavigationIcon,
  SideNavigationIcon,
  TopNavigationIcon,
  TwoColumnNavigationIcon,
} from "@/icons/local-icons"
import type { NavigationType } from "@/interface"
import { MIXED_NAVIGATION, SIDE_NAVIGATION, TOP_NAVIGATION, TWO_COLUMN_NAVIGATION } from "./constants"
import type { RootState } from "@/store"
import { setNavigationStyle } from "@/store/modules/preferences"
import { cn, useAppDispatch } from "@/utils/methods"
import { Icon } from "@iconify/react"
import { startTransition, useEffect, useMemo, useState, type ComponentType, type SVGProps } from "react"
import { useSelector } from "react-redux"
import { Divider, Tooltip } from "tdesign-react"

type NavIcon = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

const NAV_ICON_CLASS = "h-[0.63em] w-[1em] text-6xl"

function TipIcon({ tip }: { tip: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  const trigger = (
    <span
      className="inline-flex cursor-help items-center text-td-text-placeholder hover:text-td-text-secondary"
      onClick={(e) => e.stopPropagation()}
    >
      <Icon icon="ri:question-line" width={13} height={13} />
    </span>
  )

  /* Drawer/CSSTransition 挂载完成后再挂 Tooltip，避免 Popup 在未 mount 时异步 setState */
  if (!ready) return trigger

  return (
    <Tooltip content={tip} placement="bottom" destroyOnClose>
      {trigger}
    </Tooltip>
  )
}

export default function PreferencesLayout() {
  const { navigationStyle } = useSelector((state: RootState) => state.preferences)
  const dispatch = useAppDispatch()

  const navigationPreset = useMemo(
    () =>
      [
        {
          name: "侧边导航",
          tip: "左侧竖向主菜单，经典后台布局。",
          Icon: SideNavigationIcon as NavIcon,
          type: SIDE_NAVIGATION,
        },
        {
          name: "顶部导航",
          tip: "顶部横向主导航。",
          Icon: TopNavigationIcon as NavIcon,
          type: TOP_NAVIGATION,
        },
        {
          name: "双列导航",
          tip: "左侧双列菜单，适合菜单层级较多的场景。",
          Icon: TwoColumnNavigationIcon as NavIcon,
          type: TWO_COLUMN_NAVIGATION,
        },
        {
          name: "混合导航",
          tip: "顶部一级菜单 + 左侧子菜单。",
          Icon: MixedNavigationIcon as NavIcon,
          type: MIXED_NAVIGATION,
        },
      ] as const,
    [],
  )

  function handleClick(value: NavigationType) {
    startTransition(() => {
      dispatch(setNavigationStyle(value))
    })
  }

  return (
    <>
      <Divider align="center" style={{ marginTop: 16, marginBottom: 16 }}>
        布局
      </Divider>
      <ul className="m-0 grid w-full list-none grid-cols-4 gap-2 p-0">
        {navigationPreset.map((item) => {
          const active = item.type === navigationStyle
          const Preview = item.Icon
          return (
            <li key={item.type} className="min-w-0">
              <button
                type="button"
                onClick={() => handleClick(item.type)}
                className="w-full cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                <div
                  className={cn(
                    "box-border flex flex-col items-center rounded-md border-2 border-solid bg-td-bg-container px-1 py-2 transition-colors",
                    active ? "border-td-brand" : "border-td-border hover:border-td-border-strong",
                  )}
                >
                  <div className="flex h-12 w-full items-center justify-center overflow-hidden text-td-text">
                    <Preview className={NAV_ICON_CLASS} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-center gap-0.5 text-xs leading-none text-td-text">
                    <span>{item.name}</span>
                    <TipIcon tip={item.tip} />
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
