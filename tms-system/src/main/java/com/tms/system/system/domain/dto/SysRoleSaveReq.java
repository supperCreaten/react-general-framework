package com.tms.system.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色新增/修改参数。必填与前端角色表单一致：角色名称、权限字符、菜单权限。角色编码新增时由服务端生成。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysRoleSaveReq extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 修改校验组 */
    public interface Update {
    }

    /** 角色ID（修改时必填） */
    @NotNull(message = "角色ID不能为空", groups = Update.class)
    private Long roleId;

    /** 角色编码（新增不传，保存后自动生成） */
    @Size(max = 100, message = "角色编码长度不能超过100个字符")
    private String roleCode;

    /** 权限字符 */
    @NotBlank(message = "权限字符不能为空")
    @Size(max = 100, message = "权限字符长度不能超过100个字符")
    private String roleKey;

    /** 角色名称 */
    @NotBlank(message = "角色名称不能为空")
    @Size(max = 30, message = "角色名称长度不能超过30个字符")
    private String roleName;

    /** 排序 */
    private Integer roleSort;

    /** 角色状态（0正常 1停用） */
    private String status;

    /** 菜单权限 */
    @NotEmpty(message = "请选择菜单权限")
    private Long[] menuIds;
}
