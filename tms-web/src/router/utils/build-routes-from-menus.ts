import type { AppRouteRecordRaw, MenuItemType, RouteMeta } from "@/interface";
import { normalizeKeepAlive } from "@/router/utils/flat-route-list";
import { flattenLayoutRouteChildren } from "@/router/utils/flatten-layout-routes";
import type { ComponentType} from "react";
import { lazy, type LazyExoticComponent, type ReactNode } from "react";
import CreateComponent from "@/components/CreateComponent";

/** Vite glob 懒加载函数 */
type PageModuleLoader = () => Promise<{ default: ComponentType<object> }>;

/**
 * 叶子菜单补上的 index 子节点（仅保留转换所需字段）。
 * 字段名使用路由侧的 `handle`（内容仍来自菜单 `meta`）。
 */
type IndexChildNode = {
  index: true;
  handle: MenuItemType["meta"];
  component: string;
  children?: undefined;
};

/** 递归转换时的节点：普通菜单或 index 子节点 */
type TransformNode = (MenuItemType & { index?: boolean }) | IndexChildNode;

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

/** 是否为 ensureIndexChild 生成的 index 子节点 */
const isIndexChildNode = (node: TransformNode): node is IndexChildNode =>
  !("meta" in node) && node.index === true;

/**
 * 将后端菜单树转为前端路由（懒加载页面，并展平到根 Layout 下）。
 *
 * 流程：叶子菜单补 index 子节点 → 递归转路由并挂组件 → 展平叶子路由。
 *
 * @param menus - 菜单树 `MenuItemType[]`（通常为 store 的 `wholeMenus`）
 * @returns 展平后的路由 `AppRouteRecordRaw[]`；`menus` 为空时返回 `[]`
 */
export function buildRoutesFromMenus(menus: Array<MenuItemType>): AppRouteRecordRaw[] {
  if (!menus?.length) return [];

  /**
   * 单个节点 → 路由记录。
   *
   * 分支：
   * - index 子节点：用 `parentPagePath` 挂组件
   * - 叶子：按自身 path/component 挂组件
   * - 有 children 且有父路径：先挂本层 index，再递归子菜单
   * - 顶级有 children：只生成子树（Layout 由 baseRoutes 提供）
   *
   * @param menuItem - {@link TransformNode}
   * @param parentPagePath - 父级页面模块路径 `string | undefined`
   * @returns 路由记录 {@link AppRouteRecordRaw}
   */
  const transformRoute = (menuItem: TransformNode, parentPagePath?: string): AppRouteRecordRaw => {
    // IndexChildNode 用 handle；普通菜单用 meta。后续分支与原先一致。
    const meta = isIndexChildNode(menuItem) ? menuItem.handle : menuItem.meta;
    const path = isIndexChildNode(menuItem) ? undefined : menuItem.path;
    const children = isIndexChildNode(menuItem) ? undefined : menuItem.children;
    const isIndex = isIndexChildNode(menuItem) ? true : menuItem.index;
    const component = menuItem.component;

    const isIndexRoute = isIndex === true;
    const routeBase = createRouteBase(meta, component);
    const route: AppRouteRecordRaw = isIndexRoute
      ? { index: true, ...routeBase }
      : { path: path as string, ...routeBase };

    // index 子节点：组件跟父菜单
    if (isIndexRoute && parentPagePath) {
      loadRouteComponent(route, parentPagePath);
      return route;
    }

    // 叶子：挂本页组件
    if (!children?.length) {
      loadRouteComponent(route, resolvePageModulePath(route));
      return route;
    }

    const pagePath = resolvePageModulePath(route);

    // 嵌套中间层：index + 子菜单
    if (parentPagePath) {
      const indexRoute: AppRouteRecordRaw = {
        index: true,
        ...routeBase,
      };
      loadRouteComponent(indexRoute, resolvePageModulePath(indexRoute));
      route.children = [indexRoute, ...children.map((child) => transformRoute(child, pagePath))];
      return route;
    }

    // 顶级：只生成子树
    route.children = children.map((child) => transformRoute(child, pagePath));
    return route;
  };

  /**
   * 叶子菜单（无 children）补一个 index 子节点，便于统一挂载页面。
   * 已有 children 时原样返回。
   * 仅保留转换用到的字段；`meta` 改名为 `handle`（内容不变）。
   *
   * @param menu - 菜单节点 {@link MenuItemType}
   * @returns 标准化后的菜单
   */
  const ensureIndexChild = (menu: MenuItemType): MenuItemType => {
    if (menu.children?.length) return menu;

    const indexChild: IndexChildNode = {
      index: true,
      handle: { ...menu.meta },
      component: menu.component,
      children: undefined,
    };

    return {
      ...menu,
      children: [indexChild as unknown as MenuItemType],
    };
  };

  const normalizedMenus = menus.map(ensureIndexChild);
  const routes = normalizedMenus.map((menu) => transformRoute(menu));
  return flattenLayoutRouteChildren(routes) as AppRouteRecordRaw[];
}
