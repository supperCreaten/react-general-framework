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
