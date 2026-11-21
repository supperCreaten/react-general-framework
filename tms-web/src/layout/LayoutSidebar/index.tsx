import { Scrollbar } from "@/components/Scrollbar";
import { usePreferences } from "@/hooks/use-preferences";

import { clsx } from "clsx";
import React from "react";

import { headerHeight, siderTriggerHeight } from "../constants";
import { Logo } from "../components/logo";
import { SiderTrigger } from "../widgets/sider-trigger";
import { useSidebarResize } from "./use-sidebar-resize";
import type { LayoutSidebarProps } from "@/interface/layout";

export type { LayoutSidebarProps } from "@/interface/layout";

export default function LayoutSidebar({ children, computedSidebarWidth }: LayoutSidebarProps) {
  const { sidebarCollapsed, isMenuDark, isDark } = usePreferences();

  return (
    <LayoutSidebarContent
      computedSidebarWidth={computedSidebarWidth}
      isMenuDark={isMenuDark}
      isDark={isDark}
      sidebarCollapsed={sidebarCollapsed}
    >
      {children}
    </LayoutSidebarContent>
  );
}

function LayoutSidebarContent({
  children,
  computedSidebarWidth,
  isMenuDark,
  isDark,
  sidebarCollapsed,
}: {
  children?: React.ReactNode;
  computedSidebarWidth: number;
  isMenuDark: boolean;
  isDark: boolean;
  sidebarCollapsed: boolean;
}) {
  const { resizing, resizeHandleProps } = useSidebarResize({
    sidebarWidth: computedSidebarWidth,
    disabled: sidebarCollapsed,
  });

  const menuText =
    isMenuDark && !isDark ? "rgba(255, 255, 255, 0.85)" : "var(--td-text-color-primary)";

  return (
    <aside
      style={
        {
          /* border-box：右边框画在 width 内，避免被顶栏/标签栏盖住出现「断线」 */
          width: computedSidebarWidth,
          boxSizing: "border-box",
          backgroundColor: isMenuDark && !isDark ? "#141414" : "var(--td-bg-color-container)",
          borderRight: "1px solid var(--td-component-border)",
          boxShadow: "3px 0 5px 0 rgb(29, 35, 41, 0.05)",
          color: menuText,
          ["--app-menu-text" as string]: menuText,
        } as React.CSSProperties
      }
      className={clsx(
        "fixed top-0 bottom-0 left-0 overflow-x-hidden overflow-y-auto",
        !resizing && "transition-[width,border-color]",
      )}
    >
      <Logo sidebarCollapsed={sidebarCollapsed} />
      <div
        className="overflow-hidden"
        style={{
          height: `calc(100% - ${headerHeight}px - ${siderTriggerHeight}px)`,
          backgroundColor: "inherit",
        }}
      >
        <Scrollbar>{children}</Scrollbar>
      </div>

      <SiderTrigger />

      {!sidebarCollapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="拖动调整侧边栏宽度"
          title="拖动调整宽度"
          className={clsx(
            "absolute top-0 right-0 z-20 h-full w-1.5 translate-x-1/2 cursor-col-resize touch-none",
            "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent after:transition-colors",
            "hover:after:bg-(--sidebar-resize-color)",
            resizing && "after:bg-(--sidebar-resize-color)",
          )}
          style={
            {
              ["--sidebar-resize-color" as string]: "var(--td-brand-color)",
            } as React.CSSProperties
          }
          {...resizeHandleProps}
        />
      ) : null}
    </aside>
  );
}
