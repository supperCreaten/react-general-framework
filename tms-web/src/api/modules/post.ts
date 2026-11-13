import type { TablePageResult } from "@/hooks/use-table-query";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  getPostList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/post/pageQuery", data),
  getPostDetail: (params: { postId: number | string }) =>
    request.get("/api/post/detail", { params }),
  insertPost: (data: Record<string, unknown>) => request.post("/api/post/insert", data),
  updatePost: (data: Record<string, unknown>) => request.post("/api/post/update", data),
  deletePost: (params: { postId: number | string }) => request.get("/api/post/delete", { params }),
};
