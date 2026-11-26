package com.tms.system.system.domain.dto;

import lombok.Data;

/**
 * 用户角色关联写入参数
 */
@Data
public class SysUserRoleSaveReq {
    /** 主键ID */
    private Long id;

    /** 用户ID */
    private Long userId;

    /** 角色ID */
    private Long roleId;
}
