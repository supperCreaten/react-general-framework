package com.tms.system.system.service;

import java.util.List;
import java.util.Set;

import com.tms.common.core.domain.TreeSelect;
import com.tms.system.system.domain.vo.SysMenuVo;
import com.tms.system.system.domain.dto.SysMenuQuery;
import com.tms.system.system.domain.dto.SysMenuSaveReq;
import com.tms.system.system.domain.vo.AuthMenuVo;

/**
 * 菜单 业务层
 *
 * @author tms
 */
public interface ISysMenuService {
    /**
     * 根据用户查询系统菜单列表
     *
     * @param userId 用户ID
     * @return 菜单列表
     */
     List<SysMenuVo> selectMenuList(Long userId);

    /**
     * 根据用户查询系统菜单列表
     *
     * @param query  菜单查询条件
     * @param userId 用户ID
     * @return 菜单列表
     */
     List<SysMenuVo> selectMenuList(SysMenuQuery query, Long userId);

    /**
     * 菜单管理列表（懒加载返回直属子级，否则返回树）
     *
     * @param query  菜单查询条件
     * @param userId 用户ID
     * @return 菜单树或子级
     */
    List<SysMenuVo> selectMenuManageList(SysMenuQuery query, Long userId);

    List<SysMenuVo> selectAllMenuList();

    /**
     * 根据用户ID查询权限
     *
     * @param userId 用户ID
     * @return 权限列表
     */
     Set<String> selectMenuPermsByUserId(Long userId);

    /**
     * 根据角色ID查询权限
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
     Set<String> selectMenuPermsByRoleId(Long roleId);

    /**
     * 根据用户ID查询菜单树信息
     *
     * @param userId 用户ID
     * @return 菜单列表
     */
     List<SysMenuVo> selectMenuTreeByUserId(Long userId);

    /**
     * 根据角色ID查询菜单树信息
     *
     * @param roleId 角色ID
     * @return 选中菜单列表
     */
    List<Long> selectMenuListByRoleId(Long roleId);

    /**
     * 构建授权路由（对齐 server /api/authRoutes 返回结构）
     *
     * @param menus 菜单树
     * @return 前端 MenuInfo 结构
     */
    List<AuthMenuVo> buildAuthRoutes(List<SysMenuVo> menus);

    /**
     * 构建前端所需要树结构
     *
     * @param menus 菜单列表
     * @return 树结构列表
     */
    List<SysMenuVo> buildMenuTree(List<SysMenuVo> menus);

    /**
     * 构建前端所需要下拉树结构
     *
     * @param menus 菜单列表
     * @return 下拉树结构列表
     */
    List<TreeSelect> buildMenuTreeSelect(List<SysMenuVo> menus);

    /**
     * 根据菜单ID查询信息
     *
     * @param menuId 菜单ID
     * @return 菜单信息
     */
    SysMenuVo selectMenuById(Long menuId);

    /**
     * 菜单详情
     *
     * @param menuId 菜单ID
     * @return 菜单详情
     */
    SysMenuVo selectMenuVoById(Long menuId);

    /**
     * 是否存在菜单子节点
     *
     * @param menuId 菜单ID
     * @return 结果 true 存在 false 不存在
     */
    boolean hasChildByMenuId(Long menuId);

    /**
     * 查询菜单是否存在角色
     *
     * @param menuId 菜单ID
     * @return 结果 true 存在 false 不存在
     */
    boolean checkMenuExistRole(Long menuId);

    /**
     * 新增保存菜单信息
     *
     * @param menu 菜单保存参数
     * @return 结果
     */
    int insertMenu(SysMenuSaveReq menu);
    /**
     * 修改保存菜单信息
     *
     * @param menu 菜单信息
     * @return 结果
     */
    int updateMenu(SysMenuVo menu);

    /**
     * 修改保存菜单信息
     *
     * @param menu 菜单保存参数
     * @return 结果
     */
    int updateMenu(SysMenuSaveReq menu);

    /**
     * 保存菜单排序
     *
     * @param menuIds   菜单ID
     * @param orderNums 排序ID
     */
    void updateMenuSort(String[] menuIds, String[] orderNums);

    /**
     * 删除菜单管理信息
     *
     * @param menuId 菜单ID
     * @return 结果
     */
    int deleteMenuById(Long menuId);

    /**
     * 校验菜单名称是否唯一
     *
     * @param menu 菜单信息
     * @return 结果
     */
    boolean checkMenuNameUnique(SysMenuVo menu);

    /**
     * 校验菜单名称是否唯一
     *
     * @param menu 菜单保存参数
     * @return 结果
     */
    boolean checkMenuNameUnique(SysMenuSaveReq menu);

    /**
     * 校验路由组合是否唯一
     *
     * @param menu 菜单信息
     * @return 结果
     */
    boolean checkRouteConfigUnique(SysMenuVo menu);

    /**
     * 校验路由组合是否唯一
     *
     * @param menu 菜单保存参数
     * @return 结果
     */
    boolean checkRouteConfigUnique(SysMenuSaveReq menu);
}
