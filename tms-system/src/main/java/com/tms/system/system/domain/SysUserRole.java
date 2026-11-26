package com.tms.system.system.domain;

import lombok.Data;

/**
 * 用户和角色关联 sys_user_role
 *
 * @author tms
 */
@Data
public class SysUserRole {
    /**
     * 主键ID
     */
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 角色ID
     */
    private Long roleId;
}
