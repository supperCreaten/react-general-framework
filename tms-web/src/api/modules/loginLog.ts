import type { TablePageResult } from "@/hooks/use-table-query";
import type { TableRowData } from "tdesign-react";
import request from "@/utils/service";

export default {
  /** 登录日志分页列表 */
  getLoginLogList: <T extends TableRowData>(data: Record<string, unknown>) =>
    request.post<TablePageResult<T>>("/api/log/pageQuery", data),
  /** 根据日志 ID 获取登录日志详情 */
  getLoginLogDetail: <T = unknown>(params: { infoId: number | string }) =>
    request.get<T>("/api/log/detail", { params }),
  /** 批量删除登录日志 */
  deleteLoginLog: <T = unknown>(data: { infoIds: (number | string)[] }) =>
    request.post<T>("/api/log/delete", data),
  /** 按保留天数清理历史登录日志 */
  cleanLoginLog: <T = unknown>(data: { days: number }) =>
    request.post<T>("/api/log/clean", data),
};
