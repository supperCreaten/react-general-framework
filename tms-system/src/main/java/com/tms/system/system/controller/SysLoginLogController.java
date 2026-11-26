package com.tms.system.system.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.tms.common.enums.BusinessType;
import com.tms.system.system.domain.SysLogininfor;
import com.tms.system.system.service.ISysLogininforService;

/**
 * 登录日志
 */
@RestController
@Tag(name = "登录日志")
@RequestMapping("/log")
public class SysLoginLogController extends BaseController
{
    @Autowired
    private ISysLogininforService logininforService;

    /**
     * 分页查询
     */
    @PreAuthorize("@ss.hasPermi('system:loginLog:list')")
    @Operation(summary = "登录日志分页")
    @PostMapping("/pageQuery")
    public AjaxResult pageQuery(@RequestBody(required = false) SysLogininfor query)
    {
        startPage();
        return getDataTable(logininforService.selectLogininforList(query == null ? new SysLogininfor() : query));
    }

    /**
     * 查询详情
     */
    @PreAuthorize("@ss.hasPermi('system:loginLog:query')")
    @Operation(summary = "登录日志详情")
    @GetMapping("/detail")
    public AjaxResult detail(@RequestParam Long infoId)
    {
        return success(logininforService.selectLogininforById(infoId));
    }

    /**
     * 删除
     */
    @PreAuthorize("@ss.hasPermi('system:loginLog:remove')")
    @Log(title = "登录日志", businessType = BusinessType.DELETE, bizId = "#body['infoIds']")
    @Operation(summary = "删除登录日志")
    @PostMapping("/delete")
    public AjaxResult delete(@RequestBody Map<String, Object> body)
    {
        Object ids = body.get("infoIds");
        if (ids instanceof java.util.Collection<?> collection)
        {
            Long[] infoIds = collection.stream().map(v -> Long.valueOf(String.valueOf(v))).toArray(Long[]::new);
            return toAjax(logininforService.deleteLogininforByIds(infoIds));
        }
        return error("参数不正确");
    }

    /**
     * 清空
     */
    @PreAuthorize("@ss.hasPermi('system:loginLog:remove')")
    @Log(title = "登录日志", businessType = BusinessType.CLEAN)
    @Operation(summary = "清空登录日志")
    @PostMapping("/clean")
    public AjaxResult clean(@RequestBody(required = false) Map<String, Object> body)
    {
        Integer days = null;
        if (body != null && body.get("days") != null)
        {
            days = Integer.valueOf(String.valueOf(body.get("days")));
        }
        if (days != null && days > 0)
        {
            logininforService.cleanLogininforByDays(days);
        }
        else
        {
            logininforService.cleanLogininfor();
        }
        return success();
    }
}

