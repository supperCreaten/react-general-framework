package com.tms.system.domain.convert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.tms.common.core.domain.entity.SysDept;
import com.tms.system.domain.dto.SysDeptQuery;
import com.tms.system.domain.dto.SysDeptSaveReq;
import com.tms.system.domain.vo.SysDeptVo;

/**
 * 部门 DTO / Entity / VO 转换
 */
public final class SysDeptConvert {
    private SysDeptConvert() {
    }

    /**
     * 查询条件转部门实体（用于列表筛选）
     *
     * @param query 部门查询条件
     * @return 部门实体
     */
    public static SysDept toEntity(SysDeptQuery query) {
        SysDept dept = new SysDept();
        if (query == null) {
            return dept;
        }
        dept.setDeptName(query.getDeptName());
        dept.setParentId(query.getParentId());
        dept.setStatus(query.getStatus());
        return dept;
    }

    /**
     * 保存请求转部门实体
     *
     * @param req 部门保存请求
     * @return 部门实体
     */
    public static SysDept toEntity(SysDeptSaveReq req) {
        SysDept dept = new SysDept();
        if (req == null) {
            return dept;
        }
        dept.setDeptId(req.getDeptId());
        dept.setParentId(req.getParentId());
        dept.setDeptName(req.getDeptName());
        dept.setOrderNum(req.getOrderNum());
        dept.setLeader(req.getLeader());
        dept.setPhone(req.getPhone());
        dept.setEmail(req.getEmail());
        dept.setStatus(req.getStatus());
        dept.setRemark(req.getRemark());
        return dept;
    }

    /**
     * 部门实体转展示 VO（含子节点递归转换）
     *
     * @param dept 部门实体
     * @return 部门 VO，入参为 null 时返回 null
     */
    public static SysDeptVo toVo(SysDept dept) {
        if (dept == null) {
            return null;
        }
        SysDeptVo vo = new SysDeptVo();
        vo.setDeptId(dept.getDeptId());
        vo.setParentId(dept.getParentId());
        vo.setAncestors(dept.getAncestors());
        vo.setDeptName(dept.getDeptName());
        vo.setOrderNum(dept.getOrderNum());
        vo.setLeader(dept.getLeader());
        vo.setPhone(dept.getPhone());
        vo.setEmail(dept.getEmail());
        vo.setStatus(dept.getStatus());
        vo.setCreateBy(dept.getCreateBy());
        vo.setCreateTime(dept.getCreateTime());
        vo.setRemark(dept.getRemark());
        vo.setHasChildren(dept.getHasChildren());
        vo.setChildren(toVoList(dept.getChildren()));
        return vo;
    }

    /**
     * 部门实体列表转 VO 列表
     *
     * @param list 实体或混合列表（仅处理 {@link SysDept} 元素）
     * @return VO 列表
     */
    @SuppressWarnings("unchecked")
    public static List<SysDeptVo> toVoList(List<?> list) {
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        }
        List<SysDeptVo> result = new ArrayList<>(list.size());
        for (Object item : list) {
            if (item instanceof SysDept dept) {
                result.add(toVo(dept));
            }
        }
        return result;
    }
}
