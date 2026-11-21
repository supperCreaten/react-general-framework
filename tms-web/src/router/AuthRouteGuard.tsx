import api from "@/api";
import { unwrapArray } from "@/utils/service";
import LoadingScreen from "@/plugins/LoadingScreen";
import { setMenuList } from "@/store/modules/menu";
import { normalizeUserInfoRes, setUserInfo, type UserInfoApiRes } from "@/store/modules/user";
import type { MenuInfo } from "@/interface";
import { generateMenuItemsFromMenuTree } from "@/utils/menu";
import type { RootState } from "@/store";
import { getAccessToken, logout } from "@/utils/auth";
import { isEmptyObject } from "@/utils/is";
import { showMessage, useAppDispatch } from "@/utils/methods";
import { AUTH_WHITE_LIST } from "@/router/constants";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface AuthRouteGuardProps {
  children: React.ReactNode;
}

/**
 * 路由鉴权：登录态校验、用户信息/菜单拉取、白名单放行。
 * 判断顺序很重要，不要随意调整。
 */
export default function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const { pathname } = useLocation();
  const isLogin = !!getAccessToken();
  const dispatch = useAppDispatch();
  const isAuthorized = useSelector((state: RootState) => !isEmptyObject(state.user.userInfo));
  const isAccessChecked = useSelector((state: RootState) => !!state.menu.isAccessChecked);
  const isWhitelisted = (AUTH_WHITE_LIST as readonly string[]).includes(pathname);

  useEffect(() => {
    let cancelled = false;

    async function fetchUserInfoAndRoutes() {
      let userInfoRes: UserInfoApiRes | undefined;
      try {
        userInfoRes = await api.getUserInfo<UserInfoApiRes>();
      } catch {
        userInfoRes = undefined;
      }
      if (cancelled) return;

      /**
       * 用户信息为空或请求失败时不请求菜单接口
       * 若依结构为 { permissions, roles, user }，以 user 是否为空为准
       */
      const normalized = normalizeUserInfoRes(userInfoRes);
      if (isEmptyObject(normalized.userInfo)) {
        showMessage("未获取到用户信息,请联系管理员", "warning");
        await logout();
        return;
      }
      if (cancelled) return;

      /** 与菜单请求并行预取 Layout，鉴权结束即可直接渲染壳层 */
      const layoutPrefetch = import("@/layout");
      let menuRes: MenuInfo[] | undefined;
      try {
        menuRes = await api.getAuthMenus<MenuInfo[]>();
      } catch {
        menuRes = undefined;
      }
      if (cancelled) return;

      await layoutPrefetch.catch(() => undefined);
      if (cancelled) return;

      const data = unwrapArray<MenuInfo>(menuRes);
      const menuList = generateMenuItemsFromMenuTree(data);
      // 用户信息与菜单一起写入，避免中途 isAuthorized 变化触发 effect 清理导致菜单未写入、一直 Loading
      dispatch(setUserInfo(userInfoRes));
      dispatch(setMenuList(menuList ?? []));
      if (!data?.length) {
        showMessage("未获取到菜单数据,请联系管理员", "warning");
      }
    }

    if (isLogin && !isWhitelisted && !isAuthorized) {
      void fetchUserInfoAndRoutes();
    }

    return () => {
      cancelled = true;
    };
  }, [pathname, isLogin, isAuthorized, isWhitelisted, dispatch]);

  // 白名单且无 token，允许访问（如登录页）
  if (isWhitelisted && !isLogin) {
    return children;
  }
  /**
   * 未登录：跳转登录页
   */
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }
  /**
   * 已登录访问 login：跳转首页
   * 放到用户信息前，因为 login 路由不会请求用户信息
   */
  if (pathname === "/login") {
    return <Navigate to={import.meta.env.VITE_BASE_HOME_PATH} replace />;
  }
  /**
   * 等待用户信息 / 菜单路由就绪
   */
  if (!isAuthorized || !isAccessChecked) {
    return <LoadingScreen />;
  }
  /**
   * 根路由跳转首页（获取完用户信息后再跳，避免重复请求用户信息）
   */
  if (pathname === "/") {
    return <Navigate to={import.meta.env.VITE_BASE_HOME_PATH} replace />;
  }

  return children;
}
