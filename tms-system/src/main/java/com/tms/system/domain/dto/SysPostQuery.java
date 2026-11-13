package com.tms.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 岗位列表查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysPostQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 岗位编码 */
    private String postCode;

    /** 岗位名称 */
    private String postName;

    /** 部门ID */
    private Long deptId;

    /** 状态（0正常 1停用） */
    private String status;
}
