import type { MIXED_NAVIGATION, SIDE_NAVIGATION, TOP_NAVIGATION, TWO_COLUMN_NAVIGATION } from "@/hooks/use-layout/constants"
import type store from "@/store"
import type { ReactNode } from "react"
import type { IndexRouteObject, NonIndexRouteObject } from "react-router-dom"
import type { ColProps, FormItemProps } from "tdesign-react"
import type {
  FormListField,
  FormListFieldOperation,
  NamePath,
  TdFormListProps,
} from "tdesign-react/es/form/type"

export type MenuMode = "horizontal" | "vertical"
export type MenuTheme = "light" | "dark"

export interface MenuInfo {
  path: string
  component: string
  hidden: boolean
  menuId: string
  menuType: number
  meta: {
    title: string
    icon: string
    keepAlive?: boolean | number
  }
  parentId: string | number
  children?: MenuInfo[] | null
}
export type MenuItemType = {
  key: string
  label?: ReactNode
  icon?: ReactNode
  path: string
  component: string
  /**
   * 菜单类型（与后端 Integer 一致）：0 目录 / 1 菜单 / 2 按钮 / 3 页面。
   * 路由生成据此区分「目录不挂页」与「菜单挂自身页 + 子页面」。
   */
  menuType: number
  level: number
  hidden: boolean
  disabled?: boolean
  meta: {
    title: string
    icon: string
    keepAlive?: boolean | number
  }
  children: MenuItemType[] | undefined
}

/** 递归菜单项所需的最小字段约束 */
export type MenuNode = {
  key: string
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  hidden?: boolean
  children?: MenuNode[]
}

export interface LayoutMenuItemProps<T extends MenuNode = MenuItemType> {
  menus?: T[] | null
}

export type AppDispatch = typeof store.dispatch
export interface MenuInitialState {
  wholeMenus: MenuItemType[]
  isAccessChecked: boolean
}
export interface RouteMeta {
  /**
   * 路由标题，通常用于页面标题或者侧边栏菜单显示
   */
  title: ReactNode

  /**
   * 菜单图标，用于侧边栏菜单项的图标显示
   */
  icon?: ReactNode

  /**
   * 菜单排序，用于控制侧边栏菜单的显示顺序
   */
  order?: number

  /**
   * 用于配置页面的权限，只有拥有对应权限的用户才能访问页面，不配置则不需要权限。
   */
  roles?: string[]

  /**
   * 页面内按钮级别的权限，用于控制页面内按钮的显示和隐藏
   */
  permissions?: string[]

  /**
   * 设置页面是否开启缓存，开启后页面会缓存，不会重新加载，仅在标签页启用时有效。
   * @default true
   */
  keepAlive?: boolean | number

  /**
   * 是否在菜单中隐藏，用于控制某些路由不在侧边栏菜单中显示
   */
  hideInMenu?: boolean

  /**
   * iframe链接，如果路由需要在iframe中加载外部页面时使用
   */
  iframeLink?: string

  /**
   * 外部链接，点击后直接在新标签页中打开
   */
  externalLink?: string

  /**
   * 用于配置页面是否忽略权限，直接可以访问
   */
  ignoreAccess?: boolean

  /**
   * @description 指定当前激活的菜单，适用于动态路由情景下激活父菜单
   * @example 从父路由 '/user/info' 导航到子路由 '/user/info/1' 时，可以手动手动指定以高亮显示父菜单 '/user/info'
   */
  currentActiveMenu?: string

  /**
   * 当前路由为请求后端接口得到的
   */
  backstage?: boolean
}
export interface IndexRouteMeta extends Omit<IndexRouteObject, "id" | "Component"> {
  handle: RouteMeta
  component: string
}
export interface NonIndexRouteMeta extends Omit<NonIndexRouteObject, "id" | "Component"> {
  handle: RouteMeta
  component: string
  children?: AppRouteRecordRaw[]
}
export type AppRouteRecordRaw = IndexRouteMeta | NonIndexRouteMeta
export interface LayoutMenuProps {
  mode?: MenuMode
  /**
   * 控制是否自动展开当前路由对应的菜单项
   *
   * Why?
   * 注意：当菜单模式为顶部导航模式，菜单 mode 为 horizontal，初次进入页面时，菜单不应自动展开，可以指定 autoExpandCurrentMenu 为 false 关闭自动展开功能
   * @see https://github.com/user-attachments/assets/705ae01d-db7f-4f42-b4dd-66adba0dd68f
   */
  autoExpandCurrentMenu?: boolean
  menus?: MenuItemType[]
  wholeMenus?: MenuItemType[]
  handleMenuSelect?: (key: string, mode: MenuMode) => void
}
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
interface AnimationState {
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
interface LayoutState {
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
export interface TabItemProps {
  key: string
  label: ReactNode
  closable?: boolean
  /**
   * @zh 是否可拖拽
   * @en Whether it can be dragged.
   */
  draggable?: boolean
  /**
   * 可选的历史状态值，如 search 和 hash，可存储于此
   * 在目标路由中可通过 useLocation 钩子访问该状态
   * @see {@link https://reactrouter.com/en/main/hooks/use-navigate#optionsstate | usenavigate - options state}
   */
  historyState?: Record<string, unknown>
}

/** 动态字段行元信息（对应 TDesign FormListField） */
export type FormFieldListRow = FormListField
/** 动态字段增删操作（对应 TDesign FormListFieldOperation） */
export type FormFieldListOperation = FormListFieldOperation

/** 动态字段每一行内的子字段配置（name 相对当前行） */
export interface FormFieldListItemConfig extends Omit<FormItemProps, "name" | "children"> {
  name: string | number
  colProps?: ColProps
  component:
    | React.ReactNode
    | ((ctx: {
        row: FormFieldListRow
        index: number
        operation: FormFieldListOperation
      }) => React.ReactNode)
  /** 为 true 时不包裹 FormItem，直接渲染 component */
  bare?: boolean
}

/** 动态增减字段配置，挂到 FormConfig.fieldList 上即可 */
export interface FormFieldListConfig {
  /** 字段名，默认取外层 FormConfig.name */
  name?: NamePath
  initialData?: TdFormListProps["initialData"]
  rules?: TdFormListProps["rules"]
  /** 每一行的子字段；与 renderRow 二选一，renderRow 优先 */
  rowFields?: FormFieldListItemConfig[]
  /** 行容器额外 className 等 */
  rowColProps?: ColProps
  showAdd?: boolean
  addText?: string
  /** 点击新增时写入的默认值 */
  defaultRow?: Record<string, unknown> | (() => Record<string, unknown>)
  showRemove?: boolean
  removeText?: string
  /** 最少条数，达到后隐藏删除 */
  min?: number
  /** 最多条数，达到后隐藏新增 */
  max?: number
  /** 完全自定义每一行 */
  renderRow?: (
    row: FormFieldListRow,
    operation: FormFieldListOperation,
    index: number,
  ) => React.ReactNode
  /** 自定义底部操作区（覆盖默认新增按钮） */
  renderFooter?: (
    rows: FormFieldListRow[],
    operation: FormFieldListOperation,
  ) => React.ReactNode
}

export interface FormConfig extends Omit<FormItemProps, "children"> {
  colProps?: ColProps
  /** 普通字段组件；配置 fieldList 时可省略 */
  component?: React.ReactNode
  /** 为 true 时不包裹 FormItem，直接渲染 component */
  bare?: boolean
  /** 配置后渲染可动态增减的字段组 */
  fieldList?: FormFieldListConfig
}
