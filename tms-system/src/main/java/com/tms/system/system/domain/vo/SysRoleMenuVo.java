package com.tms.system.system.domain.vo;

import lombok.Data;

/**
 * 角色菜单关联查询结果
 */
@Data
public class SysRoleMenuVo {
    /** 主键ID */
    private Long id;

    /** 角色ID */
    private Long roleId;

    /** 菜单ID */
    private Long menuId;
}
