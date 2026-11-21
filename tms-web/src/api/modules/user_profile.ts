import type { TablePageResult } from "@/interface/hooks";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 用户档案分页查询 */
  pageQueryProfile: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/service/userProfile/pageQuery", data),
  /** 为指定用户新增档�?*/
  insertProfile: <T = unknown>(id: string, data: Record<string, unknown>) =>
    request.post<T>(`/api/service/userProfile/insert/${id}`, data),
  /** 更新指定用户的档�?*/
  updateProfile: <T = unknown>(id: string, data: Record<string, unknown>) =>
    request.post<T>(`/api/service/userProfile/update/${id}`, data),
  /** 根据用户 ID 查询档案详情 */
  queryByIdProfile: <T = unknown>(id: string, data: string) =>
    request.post<T>(`/api/service/userProfile/queryById/${id}`, data),
  /** 删除用户档案 */
  deleteProfile: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/service/userProfile/delete", data),
};
