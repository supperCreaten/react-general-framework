package com.tms.system.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tms.common.constant.UserConstants;
import com.tms.common.core.domain.TreeSelect;
import com.tms.common.core.domain.entity.SysDept;
import com.tms.common.exception.ServiceException;
import com.tms.common.utils.StringUtils;
import com.tms.system.mapper.SysDeptMapper;
import com.tms.system.service.ISysDeptService;

/**
 * 部门管理 服务实现
 *
 * @author tms
 */
@Service
public class SysDeptServiceImpl implements ISysDeptService {
    public static final Long DEPT_ROOT_ID = 0L;

    @Autowired
    private SysDeptMapper deptMapper;

    @Override
    public List<SysDept> selectDeptList(SysDept dept) {
        return deptMapper.selectDeptList(dept == null ? new SysDept() : dept);
    }

    @Override
    public List<SysDept> buildDeptTree(List<SysDept> depts) {
        List<SysDept> returnList = new ArrayList<>();
        List<Long> tempList = depts.stream().map(SysDept::getDeptId).toList();
        for (SysDept dept : depts) {
            if (!tempList.contains(dept.getParentId())) {
                recursionFn(depts, dept);
                returnList.add(dept);
            }
        }
        if (returnList.isEmpty()) {
            returnList = depts;
        }
        return returnList;
    }

    @Override
    public List<TreeSelect> buildDeptTreeSelect(List<SysDept> depts) {
        List<SysDept> deptTrees = buildDeptTree(depts);
        return deptTrees.stream().map(TreeSelect::new).collect(Collectors.toList());
    }

    @Override
    public SysDept selectDeptById(Long deptId) {
        return deptMapper.selectDeptById(deptId);
    }

    @Override
    public boolean hasChildByDeptId(Long deptId) {
        return deptMapper.hasChildByDeptId(deptId) > 0;
    }

    @Override
    public boolean checkDeptNameUnique(SysDept dept) {
        long deptId = StringUtils.isNull(dept.getDeptId()) ? -1L : dept.getDeptId();
        Long parentId = dept.getParentId() == null ? DEPT_ROOT_ID : dept.getParentId();
        SysDept info = deptMapper.checkDeptNameUnique(dept.getDeptName(), parentId);
        if (StringUtils.isNotNull(info) && info.getDeptId() != deptId) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    @Override
    public int insertDept(SysDept dept) {
        if (dept.getParentId() == null) {
            dept.setParentId(DEPT_ROOT_ID);
        }
        if (DEPT_ROOT_ID.equals(dept.getParentId())) {
            dept.setAncestors("0");
        } else {
            SysDept parent = deptMapper.selectDeptById(dept.getParentId());
            if (parent == null || UserConstants.DEL_DELETED.equals(parent.getIsDel())) {
                throw new ServiceException("上级部门不存在");
            }
            if (!UserConstants.NORMAL.equals(parent.getStatus())) {
                throw new ServiceException("部门停用，不允许新增");
            }
            dept.setAncestors(parent.getAncestors() + "," + parent.getDeptId());
        }
        if (StringUtils.isEmpty(dept.getStatus())) {
            dept.setStatus(UserConstants.NORMAL);
        }
        return deptMapper.insertDept(dept);
    }

    @Override
    public int updateDept(SysDept dept) {
        if (dept.getParentId() == null) {
            dept.setParentId(DEPT_ROOT_ID);
        }
        SysDept newParentDept = DEPT_ROOT_ID.equals(dept.getParentId())
                ? null
                : deptMapper.selectDeptById(dept.getParentId());
        SysDept oldDept = deptMapper.selectDeptById(dept.getDeptId());
        if (StringUtils.isNotNull(oldDept)) {
            String newAncestors = newParentDept == null
                    ? "0"
                    : newParentDept.getAncestors() + "," + newParentDept.getDeptId();
            String oldAncestors = oldDept.getAncestors();
            dept.setAncestors(newAncestors);
            updateDeptChildren(dept.getDeptId(), newAncestors, oldAncestors);
        }
        int result = deptMapper.updateDept(dept);
        if (UserConstants.NORMAL.equals(dept.getStatus()) && StringUtils.isNotEmpty(dept.getAncestors())
                && !StringUtils.equals("0", dept.getAncestors())) {
            updateParentDeptStatusNormal(dept);
        }
        return result;
    }

    private void updateParentDeptStatusNormal(SysDept dept) {
        String ancestors = dept.getAncestors();
        if (StringUtils.isEmpty(ancestors)) {
            return;
        }
        String[] parts = ancestors.split(",");
        Long[] deptIds = new Long[parts.length];
        for (int i = 0; i < parts.length; i++) {
            deptIds[i] = Long.valueOf(parts[i].trim());
        }
        deptMapper.updateDeptStatusNormal(deptIds);
    }

    public void updateDeptChildren(Long deptId, String newAncestors, String oldAncestors) {
        List<SysDept> children = deptMapper.selectChildrenDeptById(deptId);
        for (SysDept child : children) {
            child.setAncestors(child.getAncestors().replaceFirst(oldAncestors, newAncestors));
        }
        if (!children.isEmpty()) {
            deptMapper.updateDeptChildren(children);
        }
    }

    @Override
    public int deleteDeptById(Long deptId) {
        return deptMapper.deleteDeptById(deptId);
    }

    private void recursionFn(List<SysDept> list, SysDept t) {
        List<SysDept> childList = getChildList(list, t);
        t.setChildren(childList);
        for (SysDept tChild : childList) {
            if (hasChild(list, tChild)) {
                recursionFn(list, tChild);
            }
        }
    }

    private List<SysDept> getChildList(List<SysDept> list, SysDept t) {
        List<SysDept> tlist = new ArrayList<>();
        Iterator<SysDept> it = list.iterator();
        while (it.hasNext()) {
            SysDept n = it.next();
            if (StringUtils.isNotNull(n.getParentId()) && n.getParentId().longValue() == t.getDeptId().longValue()) {
                tlist.add(n);
            }
        }
        return tlist;
    }

    private boolean hasChild(List<SysDept> list, SysDept t) {
        return !getChildList(list, t).isEmpty();
    }
}
