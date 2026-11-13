package com.tms.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 部门列表查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysDeptQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 部门名称 */
    private String deptName;

    /** 父部门ID（懒加载时查询直属子级） */
    private Long parentId;

    /**
     * 是否懒加载：true 时只返回指定 parentId 的直属子级（未传 parentId 则返回根节点）
     */
    private Boolean lazy;

    /** 部门状态（0正常 1停用） */
    private String status;
}
