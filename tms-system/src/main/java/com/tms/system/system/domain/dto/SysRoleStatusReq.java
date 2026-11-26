package com.tms.system.system.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 更新角色状态
 */
@Data
public class SysRoleStatusReq {
    /** 角色ID */
    @NotNull(message = "角色ID不能为空")
    private Long roleId;

    /** 角色状态（0正常 1停用） */
    @NotBlank(message = "角色状态不能为空")
    private String status;
}
