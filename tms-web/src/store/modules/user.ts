import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";
import { logout } from "@/utils/auth";
import { unwrapRecord } from "@/utils/service";

export type UserInfoPayload = {
  userInfo: Record<string, unknown>;
  permissions: string[];
  roles: string[];
};

/** 若依用户信息接口响应 */
export type UserInfoApiRes = {
  permissions?: string[];
  roles?: string[];
  user?: Record<string, unknown>;
};

/** 兼容若依结构 { permissions, roles, user } 与旧版扁平 user */
export function normalizeUserInfoRes(res?: unknown): UserInfoPayload {
  const data = unwrapRecord(res);
  if (data && typeof data === "object" && data.user && typeof data.user === "object") {
    return {
      userInfo: data.user as Record<string, unknown>,
      permissions: Array.isArray(data.permissions) ? (data.permissions as string[]) : [],
      roles: Array.isArray(data.roles) ? (data.roles as string[]) : [],
    };
  }
  return {
    userInfo: data ?? {},
    permissions: [],
    roles: [],
  };
}

/** 拉取当前登录用户信息并规范化 permissions/roles */
export const getUserInfo = createAsyncThunk("menu/getUserInfo", async () => {
  const res = await api.getUserInfo<UserInfoApiRes>();
  return normalizeUserInfoRes(res);
});

/** 清理本地态并跳转登录页；接口失败时 logout 仍会执行本地清理 */
export const userLogout = createAsyncThunk("menu/userLogout", async () => {
  await logout();
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {} as Record<string, unknown>,
    permissions: [] as string[],
    roles: [] as string[],
    avatar: "https://avatars.githubusercontent.com/u/47056890",
  },
  reducers: {
    /** 手动写入用户信息（如个人中心保存后同步） */
    setUserInfo(state, action) {
      const payload = normalizeUserInfoRes(action.payload);
      state.userInfo = payload.userInfo;
      state.permissions = payload.permissions;
      state.roles = payload.roles;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload?.userInfo ?? {};
        state.permissions = action.payload?.permissions ?? [];
        state.roles = action.payload?.roles ?? [];
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.userInfo = {};
        state.permissions = [];
        state.roles = [];
      });
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
