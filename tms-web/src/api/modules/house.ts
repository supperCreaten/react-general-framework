import type { TablePageResult } from "@/hooks/use-table-query";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 房屋信息分页查询 */
  getHousePageQuery: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/house/pageQuery", data),
  /** 新增房屋 */
  insertHouse: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/house/insert", data),
  /** 更新房屋信息 */
  updateHouse: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/house/update", data),
  /** 根据房屋 ID 查询详情 */
  getHouseDetail: <T = unknown>(id: string) =>
    request.post<T>(`/api/house/queryById/${id}`),
  /** 批量删除房屋 */
  deleteHouse: <T = unknown>(data: string[]) =>
    request.post<T>("/api/house/delete", data),
};
