import type { TablePageResult } from "@/hooks/use-table-query";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  getUserList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/user/pageQuery", data),
  getUserDetail: (params: { userId: number | string }) =>
    request.get("/api/user/detail", { params }),
  insertUser: (data: Record<string, unknown>) => request.post("/api/user/insert", data),
  updateUser: (data: Record<string, unknown>) => request.post("/api/user/update", data),
  updateUserStatus: (data: Record<string, unknown>) => request.post("/api/user/updateStatus", data),
  resetUserPassword: (data: Record<string, unknown>) =>
    request.post("/api/user/resetPassword", data),
  authUserRole: (data: Record<string, unknown>) => request.post("/api/user/authRole", data),
  deleteUser: (params: { userId: number | string }) => request.get("/api/user/delete", { params }),
  uploadUserAvatar: (data: FormData) => request.post("/api/user/avatar", data),
};
