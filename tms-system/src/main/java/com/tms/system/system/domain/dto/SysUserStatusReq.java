package com.tms.system.system.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 更新用户状态
 */
@Data
public class SysUserStatusReq {
    /** 用户ID */
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    /** 账号状态（0启用 1禁用） */
    @NotBlank(message = "用户状态不能为空")
    private String status;
}
