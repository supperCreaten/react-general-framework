import { Scrollbar } from "@/components/Scrollbar";
import { usePreferences } from "@/hooks/use-preferences";
import { FIRST_COLUMN_WIDTH_IN_TWO_COLUMN_NAVIGATION } from "@/hooks/use-layout/constants";
import type { MenuItemType } from "@/interface";
import type { CSSProperties } from "react";

import { sidebarTitleHeight, siderTriggerHeight } from "../constants";
import LayoutMenu from "../LayoutMenu";
import { SiderTrigger } from "../widgets/sider-trigger";
import FirstColumnMenu from "./firstColumnMenu";
import type { LayoutMixedSidebarProps } from "@/interface/layout";

const emptyArray: MenuItemType[] = [];
const zero = 0;

/**
 * 双列布局侧边栏
 */
export default function LayoutMixedSidebar({
  computedSidebarWidth = zero,
  sideNavItems = emptyArray,
  topNavItems = emptyArray,
  handleMenuSelect,
  sideNavMenuKeyInSplitMode,
}: LayoutMixedSidebarProps) {
  const { isMenuDark, isDark, sidebarCollapsed } = usePreferences();
  const firstColumnWidthInTwoColumnNavigation = FIRST_COLUMN_WIDTH_IN_TWO_COLUMN_NAVIGATION;
  const menuAreaHeight = sidebarCollapsed
    ? `calc(100% - ${siderTriggerHeight}px)`
    : `calc(100% - ${sidebarTitleHeight}px - ${siderTriggerHeight}px)`;
  const menuText =
    isMenuDark && !isDark ? "rgba(255, 255, 255, 0.85)" : "var(--td-text-color-primary)";
  const panelBg = isMenuDark && !isDark ? "#141414" : "var(--td-bg-color-container)";

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex"
      style={
        {
          backgroundColor: panelBg,
          boxShadow: "3px 0 5px 0 rgb(29, 35, 41, 0.05)",
          color: menuText,
          ["--app-menu-text" as string]: menuText,
        } as CSSProperties
      }
    >
      <FirstColumnMenu
        sideNavMenuKeyInSplitMode={sideNavMenuKeyInSplitMode}
        menus={topNavItems}
        handleMenuSelect={handleMenuSelect}
      />
      <div
        style={{
          width: computedSidebarWidth - firstColumnWidthInTwoColumnNavigation,
          boxSizing: "border-box",
          backgroundColor: panelBg,
          borderRight: "1px solid var(--td-component-border)",
        }}
        className="relative transition-[width]"
      >
        {!sidebarCollapsed ? (
          <h1
            className="my-0 mx-3 flex items-center truncate pl-2 text-base font-semibold text-[var(--app-menu-text,var(--td-text-color-primary))]"
            style={{ height: sidebarTitleHeight }}
          >
            {import.meta.env.VITE_GLOB_APP_TITLE}
          </h1>
        ) : null}
        <div className="overflow-hidden" style={{ height: menuAreaHeight }}>
          <Scrollbar>
            <LayoutMenu
              autoExpandCurrentMenu
              menus={sideNavItems}
              handleMenuSelect={handleMenuSelect}
            />
          </Scrollbar>
        </div>
        <SiderTrigger />
      </div>
    </aside>
  );
}
