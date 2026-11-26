package com.tms.system.system.domain.vo;

import java.util.Date;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.tms.common.annotation.Excel;
import com.tms.common.annotation.Excel.ColumnType;
import com.tms.common.core.domain.model.AuthRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 角色数据对象。
 */
@Data
@NoArgsConstructor
public class SysRoleVo implements AuthRole {
    /** 角色ID */
    @Excel(name = "角色序号", cellType = ColumnType.NUMERIC)
    private Long roleId;

    /** 角色编码。新增时为空则由服务端生成 */
    @Excel(name = "角色编码")
    @Size(max = 100, message = "角色编码长度不能超过100个字符")
    private String roleCode;

    /** 角色名称 */
    @Excel(name = "角色名称")
    @NotBlank(message = "角色名称不能为空")
    @Size(max = 30, message = "角色名称长度不能超过30个字符")
    private String roleName;

    /** 权限字符。用户菜单查询中 role_code 也会映射到此字段 */
    @Excel(name = "权限字符")
    @NotBlank(message = "权限字符不能为空")
    @Size(max = 100, message = "权限字符长度不能超过100个字符")
    private String roleKey;

    /** 显示排序，对应 order_num */
    @Excel(name = "角色排序")
    private Integer roleSort;

    /** 菜单树选择时是否父子联动，默认联动 */
    private boolean menuCheckStrictly = true;

    /** 角色状态（0正常 1停用） */
    @Excel(name = "角色状态", readConverterExp = "0=正常,1=停用")
    private String status;

    /** 删除标志（0存在 1删除），对应 is_del */
    private String isDel;

    /** 删除标志，与 isDel 相同 */
    private String delFlag;

    /** 用户是否已拥有该角色（分配角色时回显） */
    private boolean flag = false;

    /** 菜单ID组 */
    private Long[] menuIds;

    /** 角色拥有的菜单权限标识 */
    private Set<String> permissions;

    /** 已分配用户数 */
    private Integer userCount;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /** 更新者 */
    private String updateBy;

    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /** 备注 */
    private String remark;

    public SysRoleVo(Long roleId) {
        this.roleId = roleId;
    }

    /**
     * 是否超级管理员（角色ID为 1，或权限字符为 admin）
     */
    @Override
    public boolean isAdmin() {
        return isAdmin(roleId) || isAdmin(roleKey);
    }

    /** 权限字符是否为超级管理员 */
    public static boolean isAdmin(String roleKey) {
        return roleKey != null && "admin".equals(roleKey);
    }

    /** 角色ID是否为超级管理员 */
    public static boolean isAdmin(Long roleId) {
        return roleId != null && 1L == roleId;
    }
}
