package com.tms.system.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 岗位新增/修改参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysPostSaveReq extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 岗位ID（修改时必填） */
    private Long postId;

    /** 岗位编码 */
    @NotBlank(message = "岗位编码不能为空")
    @Size(min = 0, max = 64, message = "岗位编码长度不能超过64个字符")
    private String postCode;

    /** 岗位名称 */
    @NotBlank(message = "岗位名称不能为空")
    @Size(min = 0, max = 50, message = "岗位名称长度不能超过50个字符")
    private String postName;

    /** 部门ID */
    private Long deptId;

    /** 岗位排序 */
    @NotNull(message = "显示顺序不能为空")
    private Integer postSort;

    /** 状态（0正常 1停用） */
    private String status;
}
