package com.tms.system.system.domain.vo;

import lombok.Data;

/**
 * 用户角色关联查询结果
 */
@Data
public class SysUserRoleVo {
    /** 主键ID */
    private Long id;

    /** 用户ID */
    private Long userId;

    /** 角色ID */
    private Long roleId;
}
