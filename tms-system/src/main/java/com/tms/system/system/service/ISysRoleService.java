package com.tms.system.system.service;

import java.util.List;
import java.util.Set;

import com.tms.system.system.domain.vo.SysRoleVo;
import com.tms.system.system.domain.SysUserRole;
import com.tms.system.system.domain.dto.SysRoleMenuReq;
import com.tms.system.system.domain.dto.SysRoleQuery;
import com.tms.system.system.domain.dto.SysRoleSaveReq;
import com.tms.system.system.domain.dto.SysRoleStatusReq;

/**
 * 角色业务层
 *
 * @author tms
 */
public interface ISysRoleService {
    /**
     * 根据条件分页查询角色数据
     *
     * @param query 角色查询条件
     * @return 角色数据集合信息
     */
    List<SysRoleVo> selectRoleList(SysRoleQuery query);

    /**
     * 角色分页列表
     *
     * @param query 角色查询条件
     * @return 角色列表
     */
    List<SysRoleVo> selectRoleVoList(SysRoleQuery query);

    /**
     * 根据用户ID查询角色列表
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    List<SysRoleVo> selectRolesByUserId(Long userId);

    /**
     * 根据用户ID查询角色权限
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    Set<String> selectRolePermissionByUserId(Long userId);

    /**
     * 查询所有角色
     *
     * @return 角色列表
     */
    List<SysRoleVo> selectRoleAll();

    /**
     * 根据用户ID获取角色选择框列表
     *
     * @param userId 用户ID
     * @return 选中角色ID列表
     */
    List<Long> selectRoleListByUserId(Long userId);

    /**
     * 通过角色ID查询角色
     *
     * @param roleId 角色ID
     * @return 角色对象信息
     */
    SysRoleVo selectRoleById(Long roleId);

    /**
     * 角色详情
     *
     * @param roleId 角色ID
     * @return 角色详情
     */
    SysRoleVo selectRoleVoById(Long roleId);

    /**
     * 校验角色名称是否唯一
     *
     * @param role 角色信息
     * @return 结果
     */
    boolean checkRoleNameUnique(SysRoleVo role);

    /**
     * 校验角色名称是否唯一
     *
     * @param role 角色保存参数
     * @return 结果
     */
    boolean checkRoleNameUnique(SysRoleSaveReq role);

    /**
     * 校验权限字符是否唯一
     *
     * @param role 角色信息
     * @return 结果
     */
    boolean checkRoleKeyUnique(SysRoleVo role);

    /**
     * 校验权限字符是否唯一
     *
     * @param role 角色保存参数
     * @return 结果
     */
    boolean checkRoleKeyUnique(SysRoleSaveReq role);

    /**
     * 校验角色编码是否唯一
     *
     * @param role 角色信息
     * @return 结果
     */
    boolean checkRoleCodeUnique(SysRoleVo role);

    /**
     * 校验角色编码是否唯一
     *
     * @param role 角色保存参数
     * @return 结果
     */
    boolean checkRoleCodeUnique(SysRoleSaveReq role);

    /**
     * 校验角色是否允许操作
     *
     * @param role 角色信息
     */
    void checkRoleAllowed(SysRoleVo role);

    /**
     * 通过角色ID查询角色使用数量
     *
     * @param roleId 角色ID
     * @return 结果
     */
    int countUserRoleByRoleId(Long roleId);

    /**
     * 新增保存角色信息
     *
     * @param role 角色信息
     * @return 结果
     */
    int insertRole(SysRoleVo role);

    /**
     * 新增保存角色信息
     *
     * @param role 角色保存参数
     * @return 结果
     */
    int insertRole(SysRoleSaveReq role);

    /**
     * 修改保存角色信息
     *
     * @param role 角色信息
     * @return 结果
     */
    int updateRole(SysRoleVo role);

    /**
     * 修改保存角色信息
     *
     * @param role 角色保存参数
     * @return 结果
     */
    int updateRole(SysRoleSaveReq role);

    /**
     * 保存角色菜单
     *
     * @param req 角色菜单参数
     * @return 结果
     */
    int saveRoleMenu(SysRoleMenuReq req);

    /**
     * 修改角色状态
     *
     * @param role 角色信息
     * @return 结果
     */
    int updateRoleStatus(SysRoleVo role);

    /**
     * 修改角色状态
     *
     * @param req 状态参数
     * @return 结果
     */
    int updateRoleStatus(SysRoleStatusReq req);

    /**
     * 通过角色ID删除角色
     *
     * @param roleId 角色ID
     * @return 结果
     */
    int deleteRoleById(Long roleId);

    /**
     * 批量删除角色信息
     *
     * @param roleIds 需要删除的角色ID
     * @return 结果
     */
    int deleteRoleByIds(Long[] roleIds);

    /**
     * 取消授权用户角色
     *
     * @param userRole 用户和角色关联信息
     * @return 结果
     */
    int deleteAuthUser(SysUserRole userRole);

    /**
     * 批量取消授权用户角色
     *
     * @param roleId  角色ID
     * @param userIds 需要取消授权的用户数据ID
     * @return 结果
     */
    int deleteAuthUsers(Long roleId, Long[] userIds);

    /**
     * 批量选择授权用户角色
     *
     * @param roleId  角色ID
     * @param userIds 需要删除的用户数据ID
     * @return 结果
     */
    int insertAuthUsers(Long roleId, Long[] userIds);
}
