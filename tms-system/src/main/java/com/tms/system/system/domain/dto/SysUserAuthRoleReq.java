package com.tms.system.system.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 用户授权角色
 */
@Data
public class SysUserAuthRoleReq {
    /** 用户ID */
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    /** 角色组（可空，表示清空授权） */
    private Long[] roleIds;
}
