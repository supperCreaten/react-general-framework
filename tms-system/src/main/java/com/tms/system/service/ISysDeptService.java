package com.tms.system.service;

import java.util.List;
import com.tms.common.core.domain.TreeSelect;
import com.tms.system.domain.dto.SysDeptQuery;
import com.tms.system.domain.dto.SysDeptSaveReq;
import com.tms.system.domain.vo.SysDeptVo;

/**
 * 部门管理 服务层
 *
 * @author tms
 */
public interface ISysDeptService {
    /**
     * 查询部门管理数据
     */
    List<SysDeptVo> selectDeptList(SysDeptQuery query);

    /**
     * 查询部门树结构信息
     */
    List<SysDeptVo> buildDeptTree(List<SysDeptVo> depts);

    /**
     * 构建前端所需要下拉树结构
     */
    List<TreeSelect> buildDeptTreeSelect(List<SysDeptVo> depts);

    /**
     * 根据部门ID查询信息
     */
    SysDeptVo selectDeptById(Long deptId);

    /**
     * 是否存在部门子节点
     */
    boolean hasChildByDeptId(Long deptId);

    /**
     * 校验部门名称是否唯一
     */
    boolean checkDeptNameUnique(SysDeptSaveReq dept);

    /**
     * 新增保存部门信息
     */
    int insertDept(SysDeptSaveReq dept);

    /**
     * 修改保存部门信息
     */
    int updateDept(SysDeptSaveReq dept);

    /**
     * 删除部门管理信息
     */
    int deleteDeptById(Long deptId);
}
