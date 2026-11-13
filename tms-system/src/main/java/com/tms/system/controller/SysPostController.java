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
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.tms.common.annotation.Log;
import com.tms.common.core.controller.BaseController;
import com.tms.common.core.domain.AjaxResult;
import com.tms.common.core.domain.entity.SysPost;
import com.tms.common.enums.BusinessType;
import com.tms.system.domain.convert.SysPostConvert;
import com.tms.system.domain.dto.SysPostQuery;
import com.tms.system.domain.dto.SysPostSaveReq;
import com.tms.system.domain.vo.SysPostVo;
import com.tms.system.service.ISysPostService;

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
        List<SysPost> list = postService.selectPostList(SysPostConvert.toEntity(query));
        PageInfo<SysPost> pageInfo = new PageInfo<>(list);
        List<SysPostVo> rows = SysPostConvert.toVoList(list);
        return getDataTable(rows, pageInfo);
    }

    /**
     * 新增岗位
     */
    @PreAuthorize("@ss.hasPermi('system:post:edit')")
    @Log(title = "岗位管理", businessType = BusinessType.INSERT)
    @Operation(summary = "新增岗位")
    @PostMapping("/insert")
    public AjaxResult insert(@Validated @RequestBody SysPostSaveReq req) {
        SysPost post = SysPostConvert.toEntity(req);
        if (!postService.checkPostNameUnique(post)) {
            return error("新增岗位'" + post.getPostName() + "'失败，岗位名称已存在");
        }
        if (!postService.checkPostCodeUnique(post)) {
            return error("新增岗位'" + post.getPostName() + "'失败，岗位编码已存在");
        }
        return toAjax(postService.insertPost(post));
    }

    /**
     * 修改岗位
     */
    @PreAuthorize("@ss.hasPermi('system:post:edit')")
    @Log(title = "岗位管理", businessType = BusinessType.UPDATE, bizId = "#req.postId")
    @Operation(summary = "修改岗位")
    @PostMapping("/update")
    public AjaxResult update(@Validated @RequestBody SysPostSaveReq req) {
        SysPost post = SysPostConvert.toEntity(req);
        if (!postService.checkPostNameUnique(post)) {
            return error("修改岗位'" + post.getPostName() + "'失败，岗位名称已存在");
        }
        if (!postService.checkPostCodeUnique(post)) {
            return error("修改岗位'" + post.getPostName() + "'失败，岗位编码已存在");
        }
        return toAjax(postService.updatePost(post));
    }

    /**
     * 岗位详情
     */
    @PreAuthorize("@ss.hasPermi('system:post:query')")
    @Operation(summary = "岗位详情")
    @GetMapping("/detail")
    public AjaxResult detail(@RequestParam Long postId) {
        return success(SysPostConvert.toVo(postService.selectPostById(postId)));
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
