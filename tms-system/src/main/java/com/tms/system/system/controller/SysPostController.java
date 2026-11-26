package com.tms.system.system.controller;

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
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.tms.common.annotation.Log;
import com.tms.common.core.controller.BaseController;
import com.tms.common.core.domain.AjaxResult;
import com.tms.common.enums.BusinessType;
import com.tms.system.system.domain.dto.SysPostQuery;
import com.tms.system.system.domain.dto.SysPostSaveReq;
import com.tms.system.system.domain.vo.SysPostVo;
import com.tms.system.system.service.ISysPostService;

/**
 * 岗位管理（对齐 /api/post）
 *
 * @author tms
 */
@RestController
@Tag(name = "岗位管理")
@RequestMapping("/post")
public class SysPostController extends BaseController {
    @Autowired
    private ISysPostService postService;

    /**
     * 岗位分页列表
     */
    @PreAuthorize("@ss.hasPermi('system:post:list')")
    @Operation(summary = "岗位分页列表")
    @PostMapping("/pageQuery")
    public AjaxResult pageQuery(@RequestBody(required = false) SysPostQuery query) {
        startPage();
        List<SysPostVo> list = postService.selectPostList(query);
        PageInfo<SysPostVo> pageInfo = new PageInfo<>(list);
        return getDataTable(list, pageInfo);
    }

    /**
     * 新增岗位
     */
    @PreAuthorize("@ss.hasPermi('system:post:edit')")
    @Log(title = "岗位管理", businessType = BusinessType.INSERT)
    @Operation(summary = "新增岗位")
    @PostMapping("/insert")
    public AjaxResult insert(@Validated @RequestBody SysPostSaveReq req) {
        if (!postService.checkPostNameUnique(req)) {
            return error("新增岗位'" + req.getPostName() + "'失败，岗位名称已存在");
        }
        if (!postService.checkPostCodeUnique(req)) {
            return error("新增岗位'" + req.getPostName() + "'失败，岗位编码已存在");
        }
        return toAjax(postService.insertPost(req));
    }

    /**
     * 修改岗位
     */
    @PreAuthorize("@ss.hasPermi('system:post:edit')")
    @Log(title = "岗位管理", businessType = BusinessType.UPDATE, bizId = "#req.postId")
    @Operation(summary = "修改岗位")
    @PostMapping("/update")
    public AjaxResult update(@Validated @RequestBody SysPostSaveReq req) {
        if (!postService.checkPostNameUnique(req)) {
            return error("修改岗位'" + req.getPostName() + "'失败，岗位名称已存在");
        }
        if (!postService.checkPostCodeUnique(req)) {
            return error("修改岗位'" + req.getPostName() + "'失败，岗位编码已存在");
        }
        return toAjax(postService.updatePost(req));
    }

    /**
     * 岗位详情
     */
    @PreAuthorize("@ss.hasPermi('system:post:query')")
    @Operation(summary = "岗位详情")
    @GetMapping("/detail")
    public AjaxResult detail(@RequestParam Long postId) {
        return success(postService.selectPostById(postId));
    }

    /**
     * 删除岗位
     */
    @PreAuthorize("@ss.hasPermi('system:post:remove')")
    @Log(title = "岗位管理", businessType = BusinessType.DELETE, bizId = "#postId")
    @Operation(summary = "删除岗位")
    @GetMapping("/delete")
    public AjaxResult delete(@RequestParam Long postId) {
        return toAjax(postService.deletePostById(postId));
    }
}
