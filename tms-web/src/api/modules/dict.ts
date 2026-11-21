import type { TablePageResult } from "@/interface/hooks";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 字典分页查询 */
  getDictPageQuery: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/dict/pageQuery", data),
  /** 按字典编码获取全部字典项 */
  getDictByCode: <T = unknown>(data: { dictCode: string }) =>
    request.post<T>("/api/dict/allDict", data),
  /** 新增字典 */
  insertDict: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/dict/insert", data),
  /** 更新字典 */
  updateDict: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/dict/update", data),
  /** 根据字典 ID 查询详情 */
  getDictDetail: <T = unknown>(id: string) =>
    request.post<T>(`/api/dict/queryById/${id}`),
  /** 删除字典 */
  deleteDict: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/dict/delete", data),
};
