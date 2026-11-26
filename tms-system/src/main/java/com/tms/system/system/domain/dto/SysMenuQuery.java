package com.tms.system.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 菜单列表查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysMenuQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 菜单名称 */
    private String menuName;

    /** 父菜单ID（懒加载时查询直属子级） */
    private Long parentId;

    /**
     * 是否懒加载：true 时只返回指定 parentId 的直属子级（未传 parentId 则返回根节点）
     */
    private Boolean lazy;

    /** 显示状态（0显示 1隐藏） */
    private String visible;

    /** 菜单状态（0正常 1停用） */
    private String status;
}
