import { useMemo, type ReactNode } from "react";
import type { TabRenderItem, TabStateType } from "@/interface/tabs";

export type { TabRenderItem } from "@/interface/tabs";

/**
 * 将 openTabs 转为标签栏渲染数据
 */
export function useTabItems(openTabs: Map<string, TabStateType>) {
  return useMemo(
    () =>
      Array.from(openTabs.values()).map((item) => {
        const withIcon = item as TabStateType & { icon?: ReactNode };
        return {
          ...item,
          icon: withIcon.icon,
          label: item.newTabTitle ?? item.label,
        } as TabRenderItem;
      }),
    [openTabs],
  );
}
