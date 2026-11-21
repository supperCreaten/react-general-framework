package com.tms.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 部门新增/修改参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysDeptSaveReq extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 部门ID（修改时必填） */
    private Long deptId;

    /** 父部门ID */
    private Long parentId;

    /** 部门名称 */
    @NotBlank(message = "部门名称不能为空")
    @Size(min = 0, max = 50, message = "部门名称长度不能超过50个字符")
    private String deptName;

    /** 显示排序 */
    @NotNull(message = "显示排序不能为空")
    private Integer orderNum;

    /** 负责人 */
    @Size(min = 0, max = 50, message = "负责人长度不能超过50个字符")
    private String leader;

    /** 联系电话 */
    @Size(min = 0, max = 20, message = "联系电话长度不能超过20个字符")
    private String phone;

    /** 邮箱 */
    @Email(message = "邮箱格式不正确")
    @Size(min = 0, max = 100, message = "邮箱长度不能超过100个字符")
    private String email;

    /** 部门状态（0正常 1停用） */
    private String status;

    /** 祖级列表（服务端维护） */
    private String ancestors;
}
