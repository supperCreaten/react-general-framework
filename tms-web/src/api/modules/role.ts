import type { TablePageResult } from "@/hooks/use-table-query";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 角色分页列表 */
  getRoleList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/role/pageQuery", data),
  /** 新增角色 */
  insertRole: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/role/insert", data),
  /** 更新角色信息 */
  updateRole: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/role/update", data),
  /** 启用或停用角色 */
  updateRoleStatus: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/role/updateStatus", data),
  /** 根据角色 ID 获取详情 */
  getRoleDetail: <T = unknown>(params: { roleId: number | string }) =>
    request.get<T>("/api/role/detail", { params }),
  /** 查询角色已配置的菜单权限 */
  getMenuConfig: <T = unknown>(params: { roleId: number | string }) =>
    request.get<T>("/api/role/roleToMenu", { params }),
  /** 保存角色与菜单的关联权限 */
  saveMenuToRole: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/role/saveMenuToRole", data),
  /** 保存角色关联的用户 */
  setUserConfig: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/role/saveUserToRole", data),
  /** 查询角色已关联的用户 */
  getUserConfig: <T = unknown>(params: { roleId: number | string }) =>
    request.get<T>("/api/role/roleToUser", { params }),
  /** 取消用户与角色的关联 */
  cancelUserToRole: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/role/cancelUserToRole", data),
  /** 删除角色 */
  deleteRole: <T = unknown>(params: { roleId: number | string }) =>
    request.get<T>("/api/role/delete", { params }),
};
