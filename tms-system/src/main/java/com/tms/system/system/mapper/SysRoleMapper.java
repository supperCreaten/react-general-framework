package com.tms.system.system.mapper;

import java.util.List;

import com.tms.system.system.domain.dto.SysRoleSaveReq;
import com.tms.system.system.domain.vo.SysRoleVo;
import com.tms.system.system.domain.dto.SysRoleQuery;

/**
 * 角色表 数据层
 *
 * @author tms
 */
public interface SysRoleMapper {
    /**
     * 根据条件分页查询角色数据
     *
     * @param query 角色查询条件
     * @return 角色数据集合信息
     */
    List<SysRoleVo> selectRoleList(SysRoleQuery query);

    /**
     * 根据用户ID查询角色
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    List<SysRoleVo> selectRolePermissionByUserId(Long userId);

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
     * 根据用户ID查询角色
     *
     * @param userName 用户名
     * @return 角色列表
     */
    List<SysRoleVo> selectRolesByUserName(String userName);

    /**
     * 校验角色名称是否唯一
     *
     * @param roleName 角色名称
     * @return 角色信息
     */
    SysRoleVo checkRoleNameUnique(String roleName);

    /**
     * 校验权限字符是否唯一
     *
     * @param roleKey 权限字符
     * @return 角色信息
     */
    SysRoleVo checkRoleKeyUnique(String roleKey);

    /**
     * 校验角色编码是否唯一
     *
     * @param roleCode 角色编码
     * @return 角色信息
     */
    SysRoleVo checkRoleCodeUnique(String roleCode);

    /**
     * 修改角色信息
     *
     * @param role 角色信息
     * @return 结果
     */
    int updateRole(SysRoleSaveReq role);

    /**
     * 新增角色信息
     *
     * @param role 角色信息
     * @return 结果
     */
    int insertRole(SysRoleSaveReq role);

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
}
