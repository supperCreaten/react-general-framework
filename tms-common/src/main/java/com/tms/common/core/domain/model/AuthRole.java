package com.tms.common.core.domain.model;

import java.util.Set;

/**
 * 登录角色读模型。具体数据在 tms-system 的角色 VO 中。
 */
public interface AuthRole {
    /** 角色ID */
    Long getRoleId();

    /** 权限字符 */
    String getRoleKey();

    /** 角色名称 */
    String getRoleName();

    /** 角色状态（0正常 1停用） */
    String getStatus();

    /** 是否超级管理员 */
    boolean isAdmin();

    /** 菜单权限标识 */
    Set<String> getPermissions();

    /** 写入该角色计算出的菜单权限 */
    void setPermissions(Set<String> permissions);
}
