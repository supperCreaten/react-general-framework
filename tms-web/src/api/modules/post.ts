import type { TablePageResult } from "@/interface/hooks";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 岗位分页列表 */
  getPostList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/post/pageQuery", data),
  /** 根据岗位 ID 获取详情 */
  getPostDetail: <T = unknown>(params: { postId: number | string }) =>
    request.get<T>("/api/post/detail", { params }),
  /** 新增岗位 */
  insertPost: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/post/insert", data),
  /** 更新岗位信息 */
  updatePost: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/post/update", data),
  /** 删除岗位 */
  deletePost: <T = unknown>(params: { postId: number | string }) =>
    request.get<T>("/api/post/delete", { params }),
};
