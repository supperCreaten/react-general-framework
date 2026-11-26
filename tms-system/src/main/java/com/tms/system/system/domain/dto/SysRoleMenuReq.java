package com.tms.system.system.domain.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 保存角色菜单
 */
@Data
public class SysRoleMenuReq {
    /** 角色ID */
    @NotNull(message = "角色ID不能为空")
    private Long roleId;

    /** 菜单权限 */
    @NotEmpty(message = "请选择菜单权限")
    private Long[] menuIds;
}
