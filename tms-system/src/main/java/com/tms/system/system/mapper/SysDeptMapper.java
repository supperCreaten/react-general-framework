package com.tms.system.system.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import com.tms.system.system.domain.dto.SysDeptQuery;
import com.tms.system.system.domain.dto.SysDeptSaveReq;
import com.tms.system.system.domain.vo.SysDeptVo;

/**
 * 部门管理 数据层
 *
 * @author tms
 */
public interface SysDeptMapper {
    /**
     * 查询部门列表
     */
    List<SysDeptVo> selectDeptList(SysDeptQuery query);

    /**
     * 根据部门ID查询信息
     */
    SysDeptVo selectDeptById(Long deptId);

    /**
     * 是否存在子节点
     */
    int hasChildByDeptId(Long deptId);

    /**
     * 校验部门名称是否唯一
     */
    SysDeptVo checkDeptNameUnique(@Param("deptName") String deptName, @Param("parentId") Long parentId);

    /**
     * 新增部门信息
     */
    int insertDept(SysDeptSaveReq dept);

    /**
     * 修改部门信息
     */
    int updateDept(SysDeptSaveReq dept);

    /**
     * 修改所在部门正常状态
     */
    void updateDeptStatusNormal(Long[] deptIds);

    /**
     * 修改子元素关系
     */
    int updateDeptChildren(@Param("depts") List<SysDeptSaveReq> depts);

    /**
     * 根据ID查询所有子部门
     */
    List<SysDeptVo> selectChildrenDeptById(Long deptId);

    /**
     * 删除部门管理信息
     */
    int deleteDeptById(Long deptId);
}
