import type { TablePageResult } from "@/interface/hooks";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 操作日志分页列表 */
  getOperLogList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/operLog/pageQuery", data),
  /** 根据日志 ID 获取操作日志详情 */
  getOperLogDetail: <T = unknown>(params: { operId: number | string }) =>
    request.get<T>("/api/operLog/detail", { params }),
  /** 批量删除操作日志 */
  deleteOperLog: <T = unknown>(data: { operIds: (number | string)[] }) =>
    request.post<T>("/api/operLog/delete", data),
  /** 按保留天数清理历史操作日�?*/
  cleanOperLog: <T = unknown>(data: { days: number }) =>
    request.post<T>("/api/operLog/clean", data),
};
