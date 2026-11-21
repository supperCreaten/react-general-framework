import type { LayoutMenuProps, MenuItemType, MenuMode } from "@/interface"
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react"
import { useLocation } from "react-router-dom"
import { useStyles } from "./style"
import useMenu from "@/hooks/use-menu"
import { usePreferences } from "@/hooks/use-preferences"
import { useDeviceType } from "@/hooks/use-device-type"
import { SIDE_COLLAPSED_WIDTH } from "@/hooks/use-layout/constants"
import LayoutMenuItem from "./LayoutMenuItem/LayoutMenuItem"
import { Button, Menu } from "tdesign-react"
import { ChevronLeftIcon, ChevronRightIcon } from "tdesign-icons-react"

const { HeadMenu } = Menu

const emptyArray: MenuItemType[] = []
const SCROLL_STEP = 220

function collectMenuKeys(items: MenuItemType[], keySet: Set<string>) {
  for (const item of items) {
    keySet.add(item.key)
    if (item.children?.length) collectMenuKeys(item.children, keySet)
  }
}

/** 将路由选中链路解析为当前菜单树中真实存在的 value */
function resolveActiveMenuValue(menus: MenuItemType[], selectedKeys: string[], pathname: string): string | undefined {
  const keySet = new Set<string>()
  collectMenuKeys(menus, keySet)

  for (let i = selectedKeys.length - 1; i >= 0; i -= 1) {
    if (keySet.has(selectedKeys[i])) return selectedKeys[i]
  }

  let best: string | undefined
  for (const key of keySet) {
    if (pathname === key || pathname.startsWith(`${key}/`)) {
      if (!best || key.length > best.length) best = key
    }
  }
  return best
}

function syncScrollState(el: HTMLElement | null) {
  if (!el) {
    return { overflow: false, canLeft: false, canRight: false }
  }
  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
  const left = el.scrollLeft
  return {
    overflow: maxScroll > 2,
    canLeft: left > 2,
    canRight: left < maxScroll - 2,
  }
}

export default function LayoutMenu({ mode = "vertical", handleMenuSelect, menus = emptyArray }: LayoutMenuProps) {
  const classes = useStyles()
  const { pathname } = useLocation()
  const { getSelectedKeys } = useMenu()
  const { sidebarCollapsed } = usePreferences()
  const { isMobile } = useDeviceType()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({
    overflow: false,
    canLeft: false,
    canRight: false,
  })

  const isVerticalCollapsed = mode !== "horizontal" && !isMobile && sidebarCollapsed

  const activeValue = useMemo(
    () => resolveActiveMenuValue(menus, getSelectedKeys, pathname) ?? "__none__",
    [menus, getSelectedKeys, pathname],
  )
  
  const updateScrollState = useCallback(() => {
    setScrollState(syncScrollState(scrollRef.current))
  }, [])

  /** 悬停菜单项时预取页面 chunk，缩短点击后的等待 */
  const handleMenuMouseOver = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement | null)?.closest?.("[data-menu-id]")
    if (!(target instanceof HTMLElement)) return
    const menuId = target.getAttribute("data-menu-id")
    if (!menuId) return
    const slashIndex = menuId.indexOf("/")
    if (slashIndex < 0) return
  }, [])

  const onMenuChange = useCallback(
    (value: string | number) => {
      handleMenuSelect?.(String(value), mode as MenuMode)
    },
    [handleMenuSelect, mode],
  )

  const scrollByDir = useCallback(
    (dir: -1 | 1) => {
      const el = scrollRef.current
      if (!el) return
      el.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" })
      window.setTimeout(updateScrollState, 220)
    },
    [updateScrollState],
  )

  useEffect(() => {
    if (mode !== "horizontal") return
    const el = scrollRef.current
    if (!el) return

    updateScrollState()
    const onScroll = () => updateScrollState()
    el.addEventListener("scroll", onScroll, { passive: true })

    const ro = new ResizeObserver(() => updateScrollState())
    ro.observe(el)
    const menuEl = el.querySelector(".t-head-menu .t-menu")
    if (menuEl) ro.observe(menuEl)

    return () => {
      el.removeEventListener("scroll", onScroll)
      ro.disconnect()
    }
  }, [mode, menus, updateScrollState])

  useEffect(() => {
    if (mode !== "horizontal" || !activeValue) return
    const el = scrollRef.current
    if (!el) return
    const activeItem = el.querySelector(".t-menu__item.t-is-active") as HTMLElement | null
    activeItem?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" })
    window.setTimeout(updateScrollState, 220)
  }, [mode, activeValue, updateScrollState])

  if (mode !== "horizontal") {
    return (
      <div
        className={`h-full min-h-0 ${classes.verticalMenu}${isVerticalCollapsed ? ` ${classes.verticalMenuCollapsed}` : ""}`}
        onMouseOver={handleMenuMouseOver}
      >
        <Menu
          value={activeValue}
          onChange={onMenuChange}
          collapsed={isVerticalCollapsed}
          expandType={isVerticalCollapsed ? "popup" : "normal"}
          width={["100%", SIDE_COLLAPSED_WIDTH]}
        >
          <LayoutMenuItem menus={menus} />
        </Menu>
      </div>
    )
  }

  return (
    <div className={`h-full min-h-0 min-w-0 flex-1 ${classes.horizontalMenu}`} onMouseOver={handleMenuMouseOver}>
      <div className={classes.horizontalScrollShell}>
        {scrollState.overflow ? (
          <Button
            className={classes.scrollBtn}
            variant="text"
            shape="square"
            disabled={!scrollState.canLeft}
            icon={<ChevronLeftIcon size={18} />}
            onClick={() => scrollByDir(-1)}
            aria-label="向左滚动菜单"
          />
        ) : null}

        <div
          ref={scrollRef}
          className={[
            classes.horizontalScrollViewport,
            scrollState.canLeft && scrollState.canRight
              ? classes.fadeBoth
              : scrollState.canLeft
                ? classes.fadeLeft
                : scrollState.canRight
                  ? classes.fadeRight
                  : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <HeadMenu expandType="popup" value={activeValue} onChange={onMenuChange}>
            <LayoutMenuItem menus={menus} />
          </HeadMenu>
        </div>

        {scrollState.overflow ? (
          <Button
            className={classes.scrollBtn}
            variant="text"
            shape="square"
            disabled={!scrollState.canRight}
            icon={<ChevronRightIcon size={18} />}
            onClick={() => scrollByDir(1)}
            aria-label="向右滚动菜单"
          />
        ) : null}
      </div>
    </div>
  )
}
