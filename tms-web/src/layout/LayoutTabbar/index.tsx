import { clsx } from "clsx";
import { useCallback, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Tag } from "tdesign-react";
import type { RootState } from "@/store";
import { TabActionKeys, type TabMenuItem } from "./hooks/tab-actions";
import { useDropdownMenu } from "./hooks/use-dropdown-menu";
import { useTabItems } from "./hooks/use-tab-items";
import { useTabRouteSync } from "./hooks/use-tab-route-sync";
import { useStyles } from "./style";
import { useAppDispatch } from "@/utils/methods";
import { changeTabOrder } from "@/store/modules/tabs";
import { TABBAR_HOME_PATH } from "./constants";

/**
 * 多标签栏：路由同步、右键菜单、拖拽排序（TDesign Tag）
 */
export default function LayoutTabbar() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { tabbarStyleType, tabbarDraggable, tabbarShowIcon } = useSelector(
    (state: RootState) => state.preferences,
  );
  const [menuItems, onClickMenu] = useDropdownMenu();
  const { handleTabChange, activeKey } = useTabRouteSync();
  const openTabs = useSelector((state: RootState) => state.tab.openTabs);
  const tabItems = useTabItems(openTabs);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    tabKey: string;
    items: TabMenuItem[];
  } | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const handleContextMenu = useCallback(
    (event: MouseEvent, tabKey: string) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        tabKey,
        items: menuItems(tabKey),
      });
    },
    [menuItems],
  );

  const onDragStart = useCallback((tabKey: string, draggable?: boolean) => {
    if (draggable === false) return;
    setDragKey(tabKey);
  }, []);

  const onDrop = useCallback(
    (targetKey: string) => {
      if (!dragKey || dragKey === targetKey) {
        setDragKey(null);
        return;
      }
      const keys = Array.from(openTabs.keys());
      const from = keys.indexOf(dragKey);
      const to = keys.indexOf(targetKey);
      if (from >= 0 && to >= 0) {
        dispatch(changeTabOrder({ from, to }));
      }
      setDragKey(null);
    },
    [dispatch, dragKey, openTabs],
  );

  const styleClass = useMemo(() => {
    if (tabbarStyleType === "chrome") return classes.chrome;
    return "";
  }, [classes, tabbarStyleType]);

  return (
    <div className={classes.tabsContainer} onClick={closeContextMenu}>
      <div className={clsx(classes.resetTabs, styleClass)}>
        {tabItems.map((item) => {
          const closable = item.key !== TABBAR_HOME_PATH && item.closable !== false;
          const active = item.key === activeKey;
          const label = typeof item.label === "string" ? item.label : String(item.label ?? "");

          const canDrag = tabbarDraggable && item.draggable !== false;
          const icon = tabbarShowIcon ? (item as { icon?: ReactNode }).icon : null;

          return (
            <div
              key={item.key}
              className={classes.tagWrap}
              draggable={canDrag}
              onDragStart={() => {
                if (!canDrag) return;
                onDragStart(item.key, item.draggable);
              }}
              onDragOver={(event) => {
                if (!canDrag) return;
                event.preventDefault();
              }}
              onDrop={() => {
                if (!canDrag) return;
                onDrop(item.key);
              }}
              onContextMenu={(event) => handleContextMenu(event, item.key)}
            >
              <Tag
                className={clsx(classes.tabTag, active && classes.tabTagActive)}
                size="medium"
                variant={active ? "dark" : "outline"}
                theme={active ? "primary" : "default"}
                maxWidth={160}
                title={label}
                closable={closable}
                icon={icon ? <>{icon}</> : undefined}
                onClick={() => handleTabChange(item.key)}
                onClose={({ e }) => {
                  e.stopPropagation();
                  onClickMenu(TabActionKeys.CLOSE, item.key);
                }}
              >
                {label}
              </Tag>
            </div>
          );
        })}
      </div>

      {contextMenu ? (
        <div
          className={classes.contextMenu}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          {contextMenu.items.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              className={clsx(
                classes.contextMenuItem,
                item.disabled && classes.contextMenuItemDisabled,
              )}
              onClick={() => {
                if (item.disabled) return;
                onClickMenu(item.key, contextMenu.tabKey);
                closeContextMenu();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
