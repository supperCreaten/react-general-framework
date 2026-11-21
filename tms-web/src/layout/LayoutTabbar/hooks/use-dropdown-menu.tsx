import type { TabStateType } from "@/interface/tabs";
import {
  removeTab,
  closeLeftTabs,
  closeRightTabs,
  closeOtherTabs,
  closeAllTabs,
  setIsRefresh,
} from "@/store/modules/tabs";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/utils/methods";

import { TABBAR_HOME_PATH } from "../constants";
import { TabActionKeys, type TabMenuItem } from "./tab-actions";

const homePath = TABBAR_HOME_PATH;

/**
 * 自定义钩子，用于处理标签页的下拉菜单
 */
export function useDropdownMenu() {
  const { openTabs, activeKey } = useSelector(
    (state: { tab: { openTabs: Map<string, TabStateType>; activeKey: string } }) => state.tab,
  );
  const dispatch = useAppDispatch();

  const items = useCallback(
    (tabKey: string): TabMenuItem[] => {
      const keys = Array.from(openTabs.keys());
      const idx = keys.indexOf(tabKey);
      const hasClosableLeft = idx > 0 && keys.slice(0, idx).some((k) => k !== homePath);
      const noLeftToClose = tabKey === homePath || !hasClosableLeft;
      const noRightToClose = idx < 0 || idx >= keys.length - 1;

      return [
        {
          key: TabActionKeys.REFRESH,
          label: "刷新页面",
          disabled: activeKey !== tabKey,
        },
        {
          key: TabActionKeys.CLOSE,
          label: "关闭当前",
          disabled: tabKey === homePath,
        },
        {
          key: TabActionKeys.CLOSE_OTHERS,
          label: "关闭其他",
          disabled: tabKey === homePath || openTabs.size <= 2,
        },
        {
          key: TabActionKeys.CLOSE_LEFT,
          label: "关闭左侧",
          disabled: tabKey === homePath || noLeftToClose,
        },
        {
          key: TabActionKeys.CLOSE_RIGHT,
          label: "关闭右侧",
          disabled: tabKey === homePath || noRightToClose,
        },
        {
          key: TabActionKeys.CLOSE_ALL,
          label: "全部关闭",
          disabled: openTabs.size <= 1,
        },
      ];
    },
    [activeKey, openTabs],
  );

  const actions = useMemo(
    () => ({
      [TabActionKeys.REFRESH]: () => {
        // 实际刷新在 LayoutContent 内通过 aliveRef 执行（Tabbar 不在 KeepAlive 子树）
        dispatch(setIsRefresh(true));
      },
      [TabActionKeys.CLOSE]: (tabKey: string) => {
        dispatch(removeTab(tabKey));
      },
      [TabActionKeys.CLOSE_RIGHT]: (tabKey: string) => {
        dispatch(closeRightTabs(tabKey));
      },
      [TabActionKeys.CLOSE_LEFT]: (tabKey: string) => {
        dispatch(closeLeftTabs(tabKey));
      },
      [TabActionKeys.CLOSE_OTHERS]: (tabKey: string) => {
        dispatch(closeOtherTabs(tabKey));
      },
      [TabActionKeys.CLOSE_ALL]: () => {
        dispatch(closeAllTabs());
      },
    }),
    [dispatch],
  );

  const onClickMenu = useCallback(
    (menuKey: string, nodeKey: string) => {
      const action = actions[menuKey as keyof typeof actions];
      if (action) {
        action(nodeKey);
      }
    },
    [actions],
  );

  return [items, onClickMenu] as const;
}
