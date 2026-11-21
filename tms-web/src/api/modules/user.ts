import type { TablePageResult } from "@/interface/hooks";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 用户分页列表 */
  getUserList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/user/pageQuery", data),
  /** 根据用户 ID 获取详情 */
  getUserDetail: <T = unknown>(params: { userId: number | string }) =>
    request.get<T>("/api/user/detail", { params }),
  /** 新增用户 */
  insertUser: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/user/insert", data),
  /** 更新用户信息 */
  updateUser: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/user/update", data),
  /** 启用或停用用�?*/
  updateUserStatus: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/user/updateStatus", data),
  /** 重置用户密码 */
  resetUserPassword: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/user/resetPassword", data),
  /** 为用户分配角�?*/
  authUserRole: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/user/authRole", data),
  /** 删除用户 */
  deleteUser: <T = unknown>(params: { userId: number | string }) =>
    request.get<T>("/api/user/delete", { params }),
  /**
   * 上传用户头像
   * @param data FormData
   */
  uploadUserAvatar: <T = unknown>(data: FormData) => request.post<T>("/api/user/avatar", data),
};
