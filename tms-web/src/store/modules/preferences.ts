import { MIXED_NAVIGATION } from "@/hooks/use-layout/constants";
import type { PreferencesState } from "@/interface";
import { createSlice } from "@reduxjs/toolkit";

/** 与 `PreferencesState` 一致的默认偏好设置，供 slice 与测试复用 */
export const initialState: PreferencesState = {
  /* ================== General ================== */
  enableBackTop: true,
  watermark: false,
  pageLayout: "layout-right",
  enableBackendAccess: true,
  enableFrontendAceess: false,
  language: "zh-CN",

  /* ================== Theme ================== */
  themeMode: "light",
  themeRadius: 6,
  themeColorPrimary: "#1677ff",

  /* ================== Animation ================== */
  transitionProgress: true,
  transitionLoading: true,
  transitionEnable: true,
  transitionName: "fade-slide",

  /* ================== Layout ================== */
  navigationStyle: MIXED_NAVIGATION,

  /* ================== Tabbar ================== */
  tabbarEnable: true,
  tabbarPersist: false,
  tabbarDraggable: true,
  tabbarShowIcon: true,
  tabbarStyleType: "chrome",
  tabbarShowMore: true,

  /* ================== Sidebar ================== */
  sidebarEnable: true,
  sidebarWidth: 200,
  sidebarCollapsed: false,
  sidebarCollapseShowTitle: true,
  sidebarExtraCollapsedWidth: 48,
  sidebarTheme: "light",
  isSendRoutingRequest: true,
};
const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    /** 设置侧边栏折叠状态 */
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    /** 切换导航布局样式（侧栏/顶栏/混合等） */
    setNavigationStyle(state, action) {
      state.navigationStyle = action.payload;
    },
    /** 批量合并偏好配置（偏好面板保存） */
    setPreferences(state, action) {
      Object.assign(state, action.payload);
    },
  },
});
export const { setSidebarCollapsed, setNavigationStyle, setPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
