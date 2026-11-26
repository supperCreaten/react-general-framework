package com.tms.system.system.domain.dto;

import lombok.Data;

/**
 * 角色菜单关联写入参数
 */
@Data
public class SysRoleMenuSaveReq {
    /** 主键ID */
    private Long id;

    /** 角色ID */
    private Long roleId;

    /** 菜单ID */
    private Long menuId;
}
