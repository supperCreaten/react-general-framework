import type { AppRouteRecordRaw, MenuItemType, RouteMeta } from "@/interface";
import { normalizeKeepAlive } from "@/router/utils/flat-route-list";
import { flattenLayoutRouteChildren } from "@/router/utils/flatten-layout-routes";
import { isDirectoryMenu } from "@/utils/menu";
import type { ComponentType } from "react";
import { lazy, type LazyExoticComponent, type ReactNode } from "react";
import CreateComponent from "@/components/CreateComponent";

/** Vite glob 懒加载函数 */
type PageModuleLoader = () => Promise<{ default: ComponentType<object> }>;

/** 页面缺失时的兜底组件（404） */
const NotFoundPage = lazy(() => import("@/pages/notFound/index.tsx"));

/** 404 路由 element，模块内单例复用 */
const notFoundElement: ReactNode = CreateComponent(NotFoundPage);

/**
 * 构建期收集的页面模块表。
 * key：`/src/pages/.../*.tsx`；value：动态 import 函数。
 */
const pageModules = import.meta.glob(["/src/pages/**/*.tsx"]) as Record<string, PageModuleLoader>;

/** 页面模块路径 → lazy 组件缓存，避免同一页面重复包装 */
const lazyComponentCache = new Map<string, LazyExoticComponent<ComponentType<object>>>();

/**
 * 根据路由解析 pages 下的模块路径。
 * 有 `component` 时用 `/src/pages{component}.tsx`，否则用 `/src/pages{path}/index.tsx`。
 *
 * @param route - 路由记录（可含可选 `component`）
 * @returns 模块绝对路径，如 `/src/pages/system/user/index.tsx`
 */
export function resolvePageModulePath(route: AppRouteRecordRaw & { component?: string }): string {
  if (route.component) return `/src/pages${route.component}.tsx`;
  return `/src/pages${route.path}/index.tsx`;
}

/**
 * 为路由挂载懒加载页面；模块不存在时使用 404。
 * 会就地修改 `route.element`。
 *
 * @param route - 目标路由 {@link AppRouteRecordRaw}
 * @param pagePath - 页面模块路径（与 `pageModules` 的 key 一致）
 * @returns void
 */
const loadRouteComponent = (route: AppRouteRecordRaw, pagePath: string): void => {
  const moduleLoader = pageModules[pagePath];
  if (!moduleLoader) {
    route.element = notFoundElement;
    return;
  }

  let lazyComponent = lazyComponentCache.get(pagePath);
  if (!lazyComponent) {
    lazyComponent = lazy(moduleLoader);
    lazyComponentCache.set(pagePath, lazyComponent);
  }
  route.element = CreateComponent(lazyComponent);
};

/**
 * 菜单 meta → 路由 handle；仅在配置了 keepAlive 时规范化为 boolean。
 *
 * @param meta - 菜单元信息 `MenuItemType["meta"]`
 * @returns 路由 handle {@link RouteMeta}
 */
const toRouteHandle = (meta: MenuItemType["meta"]): RouteMeta => {
  if (meta.keepAlive === undefined) return { ...meta };
  return { ...meta, keepAlive: normalizeKeepAlive(meta.keepAlive) };
};

/**
 * 由菜单 meta 组装路由公共字段（尚未区分 index / path）。
 *
 * @param meta - 菜单元信息 `MenuItemType["meta"]`
 * @param component - 后端组件字段 `string`
 * @returns 含 handle、component，以及空的 children、element
 */
const createRouteBase = (meta: MenuItemType["meta"], component: string) => ({
  handle: toRouteHandle(meta),
  component,
  children: undefined as undefined,
  element: undefined as undefined,
});

/**
 * 将后端菜单树转为前端路由（懒加载页面，并展平到根 Layout 下）。
 *
 * 按 menuType 分支（展平后示例）：
 * - 叶子菜单：直接挂组件 → `/system/user`
 * - 目录(0)：只生成子树，不挂自身 → 无 `/system`，仅有其子路由
 * - 菜单(1)/页面(3) 等且有子节点：挂 index + 子路由
 *   → 「订单管理」`/order` + 「创建订单」`/order/create`
 *
 * @param menus - 菜单树 `MenuItemType[]`（通常为 store 的 `wholeMenus`）
 * @returns 展平后的路由 `AppRouteRecordRaw[]`；`menus` 为空时返回 `[]`
 */
export function buildRoutesFromMenus(menus: Array<MenuItemType>): AppRouteRecordRaw[] {
  if (!menus?.length) return [];

  /**
   * 单个菜单节点 → 路由记录（可含 children，稍后统一展平）。
   */
  const transformRoute = (menuItem: MenuItemType): AppRouteRecordRaw => {
    const { meta, path, children, component, menuType } = menuItem;
    const routeBase = createRouteBase(meta, component);
    const route: AppRouteRecordRaw = { path, ...routeBase };
    const pagePath = resolvePageModulePath(route);

    // 无子节点：叶子页面，直接挂载对应 pages 组件
    if (!children?.length) {
      loadRouteComponent(route, pagePath);
      return route;
    }

    const childRoutes = children.map((child) => transformRoute(child));

    // 目录：只负责分组，不注册自身落地页
    if (isDirectoryMenu(menuType)) {
      route.children = childRoutes;
      return route;
    }

    // 菜单等：自身作为 index 路由（如 /order），子项为相对 path（如 create → /order/create）
    const indexRoute: AppRouteRecordRaw = {
      index: true,
      ...routeBase,
    };
    loadRouteComponent(indexRoute, pagePath);
    route.children = [indexRoute, ...childRoutes];
    return route;
  };

  // 展平到 Layout 下，避免跨菜单切换时重复挂载 Layout
  return flattenLayoutRouteChildren(menus.map(transformRoute)) as AppRouteRecordRaw[];
}
