import type { TablePageResult } from "@/hooks/use-table-query";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  getRoleList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/role/pageQuery", data),
  insertRole: (data: Record<string, unknown>) => request.post("/api/role/insert", data),
  updateRole: (data: Record<string, unknown>) => request.post("/api/role/update", data),
  updateRoleStatus: (data: Record<string, unknown>) => request.post("/api/role/updateStatus", data),
  getRoleDetail: (params: { roleId: number | string }) =>
    request.get("/api/role/detail", { params }),
  getMenuConfig: (params: { roleId: number | string }) =>
    request.get("/api/role/roleToMenu", { params }),
  saveMenuToRole: (data: Record<string, unknown>) => request.post("/api/role/saveMenuToRole", data),
  setUserConfig: (data: Record<string, unknown>) => request.post("/api/role/saveUserToRole", data),
  getUserConfig: (params: { roleId: number | string }) =>
    request.get("/api/role/roleToUser", { params }),
  cancelUserToRole: (data: Record<string, unknown>) =>
    request.post("/api/role/cancelUserToRole", data),
  deleteRole: (params: { roleId: number | string }) => request.get("/api/role/delete", { params }),
};
