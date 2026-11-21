import request from "@/utils/service";

export default {
  /** 部门列表（支持懒加载/条件查询） */
  getDepts: <T = unknown>(data?: Record<string, unknown>) =>
    request.post<T>("/api/dept/pageQuery", data ?? {}),
  /** 根据部门 ID 获取详情 */
  getDeptDetail: <T = unknown>(params: { deptId: number | string }) =>
    request.get<T>("/api/dept/detail", { params }),
  /** 新增部门 */
  insertDept: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/dept/insert", data),
  /** 更新部门信息 */
  updateDept: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/dept/update", data),
  /** 删除部门 */
  deleteDept: <T = unknown>(params: { deptId: number | string }) =>
    request.get<T>("/api/dept/delete", { params }),
};
