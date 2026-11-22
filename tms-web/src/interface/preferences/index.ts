import type {
  MIXED_NAVIGATION,
  SIDE_NAVIGATION,
  TOP_NAVIGATION,
  TWO_COLUMN_NAVIGATION,
} from "@/hooks/use-layout/constants"
import type { MenuTheme } from "@/interface/menu"

/**
 * @zh 登录页面布局
 * @en Login page layout
 */
export type PageLayoutType = "layout-left" | "layout-center" | "layout-right"

export type LanguageType = "zh-CN" | "en-US"

/**
 * @zh 动画类型
 * @en Animation type
 */
export interface AnimationState {
  /**
   * @zh 是否启用过渡动画
   * @en Whether to enable transition animation
   * @default true
   */
  transitionProgress: boolean
  /**
   * @zh 是否启用加载动画
   * @en Whether to enable loading animation
   * @default true
   */
  transitionLoading: boolean
  /**
   * @zh 是否启用动画
   * @en Whether to enable animation
   * @default true
   */
  transitionEnable: boolean
  /**
   * @zh 过渡动画名称
   * @en Transition animation name
   * @default "fade-slide"
   */
  transitionName: string
}

/**
 * @zh 标签栏风格
 * @en Tabbar style
 */
export type TabsStyleType = "brisk" | "card" | "chrome" | "plain"

/**
 * @zh 导航类型
 */
export type NavigationType =
  | typeof SIDE_NAVIGATION
  | typeof TOP_NAVIGATION
  | typeof TWO_COLUMN_NAVIGATION
  | typeof MIXED_NAVIGATION

/** 外观主题模式 */
export type ThemeMode = "light" | "dark" | "system"

export interface LayoutState {
  navigationStyle: NavigationType
}

export interface GeneralState {
  /**
   * @zh 是否显示返回顶部按钮
   * @default true
   */
  enableBackTop: boolean
  /**
   * @zh 是否开启水印（内容取当前登录账号）
   * @en Whether to enable watermark
   * @default false
   */
  watermark: boolean
  /**
   * @zh 登录页面的布局配置
   * @en Login page layout configuration
   * @default "layout-right"
   */
  pageLayout: PageLayoutType
  /**
   * @zh 开启前端路由权限
   * @en Enable frontend route permissions
   * @default false
   */
  enableFrontendAceess: boolean
  /**
   * @zh 开启后端路由权限
   * @en Enable backend route permissions
   * @default true
   */
  enableBackendAccess: boolean

  /**
   * @zh 当前语言
   * @en Current language
   * @default "zh-CN"
   */
  language: LanguageType
}

export interface SidebarState {
  /**
   * 侧边栏是否可见
   * @default true
   */
  sidebarEnable?: boolean
  /**
   * 侧边菜单展开宽度（支持交界处拖拽调整）
   * @default 200
   */
  sidebarWidth: number
  /**
   * 侧边菜单折叠状态
   * @default false
   */
  sidebarCollapsed: boolean
  /**
   * 侧边菜单是否折叠时，是否显示 title
   * @default true
   */
  sidebarCollapseShowTitle: boolean
  /**
   * 侧边菜单折叠额外宽度
   * @default 48
   */
  sidebarExtraCollapsedWidth: number
  /**
   * 侧边栏主题
   * @default dark
   */
  sidebarTheme: MenuTheme
}

export interface PreferencesState extends AnimationState, LayoutState, GeneralState, SidebarState {
  /* ================== Theme ================== */
  /**
   * @zh 外观主题：浅色 / 深色 / 跟随系统
   * @default "light"
   */
  themeMode: ThemeMode
  /**
   * @zh 主题圆角值
   * @default 6
   */
  themeRadius: number
  /**
   * @zh 主题色
   * @default "#1677ff"
   */
  themeColorPrimary: string
  /* ================== Theme ================== */

  /* ================== Tabbar ================== */
  /**
   * @zh 标签栏风格
   * @en Tabbar style
   * @default "chrome"
   */
  tabbarStyleType: TabsStyleType
  /**
   * @zh 是否启用标签栏
   * @en Whether to enable tabbar
   * @default true
   */
  tabbarEnable: boolean
  /**
   * @zh 是否持久化标签页
   * @default false
   */
  tabbarPersist: boolean
  /**
   * @zh 是否允许拖拽排序标签
   * @default true
   */
  tabbarDraggable: boolean
  /**
   * @zh 是否显示标签栏图标
   * @default true
   */
  tabbarShowIcon: boolean
  /**
   * @zh 是否显示更多
   * @en Whether to show more
   * @default true
   */
  tabbarShowMore: boolean
  /**
   * 开启后端获取路由的情况下，是否发送路由请求获取路由数据
   *
   * 如果设置为 false，则不会单独发送一个请求获取路由数据，而是从用户详情接口中获取动态路由数据
   * 如果设置为 true，则会单独发送一个请求获取路由数据
   */
  isSendRoutingRequest: boolean
  /* ================== Tabbar ================== */
}

export interface ThemeModePreset {
  key: ThemeMode
  label: string
  color?: string
}

export interface ThemeColorPreset {
  key: string
  color: string
  label?: string
}
