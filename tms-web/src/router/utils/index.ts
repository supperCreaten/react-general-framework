import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { MenuItemType } from "@/interface";
import { buildRoutesFromMenus } from "@/router/utils/build-routes-from-menus";

/**
 * 根据 store 中的菜单树动态生成前端路由。
 * 菜单未就绪时返回空数组，避免鉴权完成前注册无效路由。
 */
export const useDynamicRoutes = () => {
  const { wholeMenus } = useSelector(
    (state: { menu: { wholeMenus: MenuItemType[] } }) => state.menu,
  );
  return useMemo(() => {
    if (!wholeMenus?.length) return [];
    return buildRoutesFromMenus(wholeMenus);
  }, [wholeMenus]);
};
