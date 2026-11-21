import request from "@/utils/service";

export default {
  /** 菜单列表（分页/条件查询） */
  getMenus: <T = unknown>(data?: Record<string, unknown>) =>
    request.post<T>("/api/menu/pageQuery", data ?? {}),
  /** 根据菜单 ID 获取详情 */
  getMenuDetail: <T = unknown>(params: { menuId: number | string }) =>
    request.get<T>("/api/menu/detail", { params }),
  /** 新增菜单 */
  insertMenu: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/menu/insert", data),
  /** 更新菜单信息 */
  updateMenu: <T = unknown>(data: Record<string, unknown>) =>
    request.post<T>("/api/menu/update", data),
  /** 删除菜单 */
  deleteMenu: <T = unknown>(params: { menuId: number | string }) =>
    request.get<T>("/api/menu/delete", { params }),
};
