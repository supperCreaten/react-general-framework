import { Scrollbar } from "@/components/Scrollbar";
import { usePreferences } from "@/hooks/use-preferences";
import { FIRST_COLUMN_WIDTH_IN_TWO_COLUMN_NAVIGATION } from "@/hooks/use-layout/constants";
import type { MenuItemType, MenuMode } from "@/interface";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { headerHeight } from "../constants";
import { Logo } from "../widgets/logo";

interface FirstColumnMenuProps {
  menus?: MenuItemType[];
  sideNavMenuKeyInSplitMode?: string;
  handleMenuSelect?: (key: string, mode: MenuMode) => void;
}

const emptyArray: MenuItemType[] = [];

/** 跟随主题 CSS Variables */
const ACTIVE_COLOR = "var(--td-brand-color)";
const ACTIVE_BG = "var(--td-brand-color-light)";
const ACTIVE_BORDER = "var(--td-brand-color-3, var(--app-primary-border))";

export default function FirstColumnMenu({
  handleMenuSelect,
  menus = emptyArray,
  sideNavMenuKeyInSplitMode,
}: FirstColumnMenuProps) {
  const { isMenuDark, isDark } = usePreferences();
  const firstColumnWidth = FIRST_COLUMN_WIDTH_IN_TWO_COLUMN_NAVIGATION;
  const inactiveColor =
    isMenuDark && !isDark ? "rgba(255,255,255,0.85)" : "var(--td-text-color-primary)";
  const panelBg = isMenuDark && !isDark ? "#141414" : "var(--td-bg-color-container)";

  return (
    <div
      style={{
        width: firstColumnWidth,
        backgroundColor: panelBg,
      }}
      className={clsx(
        "flex h-full shrink-0 flex-col border-r",
        "border-r-[var(--td-component-border)]",
      )}
    >
      <Logo sidebarCollapsed className="shrink-0" />
      <Scrollbar style={{ height: `calc(100% - ${headerHeight}px)` }}>
        <ul className="m-0 box-border list-none px-2 py-2">
          {menus
            .filter((item) => !item.hidden)
            .map((item) => {
              const selected = item.key === sideNavMenuKeyInSplitMode;
              return (
                <li key={item.key} className="mb-1">
                  <button
                    type="button"
                    title={String(item.label ?? item.meta?.title ?? "")}
                    className={clsx(
                      "box-border flex w-full cursor-pointer flex-col items-center justify-center gap-1 border border-solid px-1 py-2.5 text-center transition-colors",
                      "rounded-[8px] text-[12px] leading-[1.2] font-normal",
                      selected
                        ? "border-[var(--fc-active-border)] bg-[var(--fc-active-bg)] text-[var(--fc-active-color)]"
                        : "border-transparent bg-transparent text-[var(--fc-inactive-color)] hover:bg-[var(--td-bg-color-container-hover)]",
                    )}
                    style={
                      {
                        ["--fc-active-color" as string]: ACTIVE_COLOR,
                        ["--fc-active-bg" as string]: ACTIVE_BG,
                        ["--fc-active-border" as string]: ACTIVE_BORDER,
                        ["--fc-inactive-color" as string]: inactiveColor,
                      } as CSSProperties
                    }
                    onClick={() => handleMenuSelect?.(item.key, "horizontal")}
                  >
                    {item.icon ? (
                      <span
                        className={clsx(
                          "flex h-5 w-5 shrink-0 items-center justify-center",
                          "[&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-current",
                          "[&_svg_path]:fill-current [&_svg_circle]:fill-current [&_svg_rect]:fill-current",
                        )}
                      >
                        {item.icon as ReactNode}
                      </span>
                    ) : null}
                    <span className="max-w-full truncate">{item.label ?? item.meta?.title}</span>
                  </button>
                </li>
              );
            })}
        </ul>
      </Scrollbar>
    </div>
  );
}
