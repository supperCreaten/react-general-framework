import { createSlice } from "@reduxjs/toolkit";
import type { MenuInitialState } from "@/interface";
const initialState: MenuInitialState = {
  wholeMenus: [],
  isAccessChecked: false,
};
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    /** 写入动态菜单并标记权限路由已校验 */
    setMenuList(state, actions) {
      state.wholeMenus = actions.payload;
      state.isAccessChecked = true;
    },
  },
});
/** 菜单模块 state 选择器 */
export const menuDaTa = (state: { menu: MenuInitialState }) => state.menu;
export const { setMenuList } = menuSlice.actions;
//默认导出reducer动作
export default menuSlice.reducer;
