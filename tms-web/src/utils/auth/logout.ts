import store from "@/store";
import { removeToken } from "./token";

/** 退出登录并清理本地状态 */
export async function logout() {
  try {
    const { default: api } = await import("@/api");
    await api.logout();
  } catch {
    // 网络异常或 token 已失效时仍清理本地登录态
  }
  store.dispatch({ type: "auth/logout" });
  removeToken();
  window.location.href = "#/login";
}
