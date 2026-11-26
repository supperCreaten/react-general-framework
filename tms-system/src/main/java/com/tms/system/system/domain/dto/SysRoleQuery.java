package com.tms.system.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色列表查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysRoleQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 角色ID */
    private Long roleId;

    /** 角色编码 */
    private String roleCode;

    /** 角色名称 */
    private String roleName;

    /** 权限字符 */
    private String roleKey;

    /** 角色状态（0正常 1停用） */
    private String status;
}
