import type { AxiosRequestConfig } from "axios";
import request from "@/utils/service";

export default {
  /** 用户登录 */
  login: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/login", data),
  /** 获取当前用户有权限的路由菜单 */
  getAuthMenus: <T = unknown>() => request.get<T>("/api/authRoutes"),
  /** 获取当前登录用户信息 */
  getUserInfo: <T = unknown>() => request.get<T>("/api/userInfo"),
  /** 刷新访问令牌 */
  refreshToken: <T = unknown>() => request.get<T>("/api/refreshToken"),
  /** 退出登录 */
  logout: <T = unknown>() => request.post<T>("/api/logout"),
  /** 修改登录密码 */
  changePassword: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/user/changePassword", data),
  /** 个人中心：修改基本资料 */
  updateProfile: <T = unknown>(data: Record<string, unknown>) =>
    request.put<T>("/api/user/profile", data),
  /** 个人中心：修改密码 */
  updateProfilePassword: <T = unknown>(data: { oldPassword: string; newPassword: string }) =>
    request.put<T>("/api/user/profile/updatePwd", data),
  /** 解密后端返回的敏感字段密文 */
  decryptSensitive: <T = unknown>(data: { cipherText: string; secretKey: string }) =>
    request.post<T>("/api/decryptSensitive", data),
  /**
   * 通用文件上传
   * @param data FormData
   */
  uploadApi: <T = unknown>(data: FormData, config?: AxiosRequestConfig) =>
    request.post<T>("/api/upload", data, config),
};
