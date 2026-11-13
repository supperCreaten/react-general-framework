package com.tms.system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.tms.common.annotation.Log;
import com.tms.common.core.controller.BaseController;
import com.tms.common.core.domain.AjaxResult;
import com.tms.common.core.domain.entity.SysDept;
import com.tms.common.enums.BusinessType;
import com.tms.system.domain.convert.SysDeptConvert;
import com.tms.system.domain.dto.SysDeptQuery;
import com.tms.system.domain.dto.SysDeptSaveReq;
import com.tms.system.domain.vo.SysDeptVo;
import com.tms.system.service.ISysDeptService;

/**
 * 部门管理（对齐 /api/dept）
 *
 * @author tms
 */
@RestController
@Tag(name = "部门管理")
@RequestMapping("/dept")
public class SysDeptController extends BaseController {
    @Autowired
    private ISysDeptService deptService;

    /**
     * 部门列表。
     * lazy=true：按 parentId 返回直属子级（未传 parentId 则返回根节点）；否则返回完整树。
     */
    @PreAuthorize("@ss.hasPermi('system:dept:list')")
    @Operation(summary = "部门列表")
    @PostMapping("/pageQuery")
    public AjaxResult pageQuery(@RequestBody(required = false) SysDeptQuery query) {
        SysDept entity = SysDeptConvert.toEntity(query);
        boolean lazy = query != null && Boolean.TRUE.equals(query.getLazy());
        if (lazy) {
            if (entity.getParentId() == null) {
                entity.setParentId(0L);
            }
            List<SysDept> children = deptService.selectDeptList(entity);
            return success(SysDeptConvert.toVoList(children));
        }
        List<SysDept> depts = deptService.selectDeptList(entity);
        List<SysDeptVo> tree = SysDeptConvert.toVoList(deptService.buildDeptTree(depts));
        return success(tree);
    }

    /**
     * 新增部门
     */
    @PreAuthorize("@ss.hasPermi('system:dept:edit')")
    @Log(title = "部门管理", businessType = BusinessType.INSERT)
    @Operation(summary = "新增部门")
    @PostMapping("/insert")
    public AjaxResult insert(@Validated @RequestBody SysDeptSaveReq req) {
        SysDept dept = SysDeptConvert.toEntity(req);
        if (!deptService.checkDeptNameUnique(dept)) {
            return error("新增部门'" + dept.getDeptName() + "'失败，部门名称已存在");
        }
        return toAjax(deptService.insertDept(dept));
    }

    /**
     * 修改部门
     */
    @PreAuthorize("@ss.hasPermi('system:dept:edit')")
    @Log(title = "部门管理", businessType = BusinessType.UPDATE, bizId = "#req.deptId")
    @Operation(summary = "修改部门")
    @PostMapping("/update")
    public AjaxResult update(@Validated @RequestBody SysDeptSaveReq req) {
        SysDept dept = SysDeptConvert.toEntity(req);
        Long deptId = dept.getDeptId();
        if (!deptService.checkDeptNameUnique(dept)) {
            return error("修改部门'" + dept.getDeptName() + "'失败，部门名称已存在");
        }
        if (dept.getParentId() != null && dept.getParentId().equals(deptId)) {
            return error("修改部门'" + dept.getDeptName() + "'失败，上级部门不能是自己");
        }
        return toAjax(deptService.updateDept(dept));
    }

    /**
     * 部门详情
     */
    @PreAuthorize("@ss.hasPermi('system:dept:query')")
    @Operation(summary = "部门详情")
    @GetMapping("/detail")
    public AjaxResult detail(@RequestParam Long deptId) {
        return success(SysDeptConvert.toVo(deptService.selectDeptById(deptId)));
    }

    /**
     * 删除部门
     */
    @PreAuthorize("@ss.hasPermi('system:dept:remove')")
    @Log(title = "部门管理", businessType = BusinessType.DELETE, bizId = "#deptId")
    @Operation(summary = "删除部门")
    @GetMapping("/delete")
    public AjaxResult delete(@RequestParam Long deptId) {
        if (deptService.hasChildByDeptId(deptId)) {
            return warn("存在下级部门,不允许删除");
        }
        return toAjax(deptService.deleteDeptById(deptId));
    }
}
