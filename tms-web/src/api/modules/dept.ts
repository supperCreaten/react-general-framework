import request from "@/utils/service";

export default {
  getDepts: (data?: Record<string, unknown>) => request.post("/api/dept/pageQuery", data ?? {}),
  getDeptDetail: (params: { deptId: number | string }) =>
    request.get("/api/dept/detail", { params }),
  insertDept: (data: Record<string, unknown>) => request.post("/api/dept/insert", data),
  updateDept: (data: Record<string, unknown>) => request.post("/api/dept/update", data),
  deleteDept: (params: { deptId: number | string }) => request.get("/api/dept/delete", { params }),
};
