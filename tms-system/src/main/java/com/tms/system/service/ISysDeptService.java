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
     *
     * @param query 部门查询条件
     * @return 部门列表
     */
    List<SysDeptVo> selectDeptList(SysDeptQuery query);

    /**
     * 查询部门树结构信息
     *
     * @param depts 部门列表
     * @return 树结构部门列表
     */
    List<SysDeptVo> buildDeptTree(List<SysDeptVo> depts);

    /**
     * 构建前端所需要下拉树结构
     *
     * @param depts 部门列表
     * @return 下拉树结构列表
     */
    List<TreeSelect> buildDeptTreeSelect(List<SysDeptVo> depts);

    /**
     * 根据部门ID查询信息
     *
     * @param deptId 部门ID
     * @return 部门信息
     */
    SysDeptVo selectDeptById(Long deptId);

    /**
     * 是否存在部门子节点
     *
     * @param deptId 部门ID
     * @return 结果 true 存在 false 不存在
     */
    boolean hasChildByDeptId(Long deptId);

    /**
     * 校验部门名称是否唯一
     *
     * @param dept 部门信息
     * @return 结果
     */
    boolean checkDeptNameUnique(SysDeptSaveReq dept);

    /**
     * 新增保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    int insertDept(SysDeptSaveReq dept);

    /**
     * 修改保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    int updateDept(SysDeptSaveReq dept);

    /**
     * 删除部门管理信息
     *
     * @param deptId 部门ID
     * @return 结果
     */
    int deleteDeptById(Long deptId);
}