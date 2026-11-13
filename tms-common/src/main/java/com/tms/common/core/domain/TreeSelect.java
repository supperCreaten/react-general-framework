package com.tms.common.core.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tms.common.core.domain.entity.SysDept;
import com.tms.common.core.domain.entity.SysMenu;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Treeselect树结构实体类
 *
 * @author tms
 */
@Data
@NoArgsConstructor
public class TreeSelect implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 节点ID
     */
    private Long id;

    /**
     * 节点名称
     */
    private String label;

    /**
     * 节点禁用
     */
    private boolean disabled = false;

    /**
     * 子节点
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<TreeSelect> children;

    public TreeSelect(SysMenu menu) {
        this.id = menu.getMenuId();
        this.label = menu.getMenuName();
        List<SysMenu> children = menu.getChildren() == null ? new ArrayList<>() : menu.getChildren();
        this.children = children.stream().map(TreeSelect::new).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    public TreeSelect(SysDept dept) {
        this.id = dept.getDeptId();
        this.label = dept.getDeptName();
        this.disabled = "1".equals(dept.getStatus());
        List<?> rawChildren = dept.getChildren();
        List<SysDept> children = rawChildren == null ? new ArrayList<>() : (List<SysDept>) rawChildren;
        this.children = children.stream().map(TreeSelect::new).collect(Collectors.toList());
    }
}
