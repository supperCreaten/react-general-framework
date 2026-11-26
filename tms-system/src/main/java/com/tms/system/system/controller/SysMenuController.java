package com.tms.system.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import com.tms.common.annotation.Log;
import com.tms.common.constant.UserConstants;
import com.tms.common.core.controller.BaseController;
import com.tms.common.core.domain.AjaxResult;
import com.tms.common.enums.BusinessType;
import com.tms.common.utils.StringUtils;
import com.tms.system.system.domain.dto.SysMenuQuery;
import com.tms.system.system.domain.dto.SysMenuSaveReq;
import com.tms.system.system.service.ISysMenuService;
import jakarta.validation.groups.Default;

/**
 * 菜单管理（对齐 server /api/menu，无重复接口）
 *
 * @author tms
 */
@RestController
@Tag(name = "菜单管理")
@RequestMapping("/menu")
public class SysMenuController extends BaseController {
    @Autowired
    private ISysMenuService menuService;

    /**
     * 菜单列表（仅 is_del=0，含按钮）。
     * lazy=true：按 parentId 返回直属子级（未传 parentId 则返回根节点）；否则返回完整树。
     */
    @PreAuthorize("@ss.hasPermi('system:menu:list')")
    @Operation(summary = "菜单列表")
    @PostMapping("/pageQuery")
    public AjaxResult pageQuery(@RequestBody(required = false) SysMenuQuery query) {
        return success(menuService.selectMenuManageList(query, getUserId()));
    }

    /**
     * 新增菜单
     */
    @PreAuthorize("@ss.hasPermi('system:menu:edit')")
    @Log(title = "菜单管理", businessType = BusinessType.INSERT)
    @Operation(summary = "新增菜单")
    @PostMapping("/insert")
    public AjaxResult insert(@Validated @RequestBody SysMenuSaveReq menu) {
        if (!menuService.checkMenuNameUnique(menu)) {
            return error("菜单名称已存在");
        }
        if (UserConstants.YES_FRAME.equals(menu.getIsFrame()) && !StringUtils.ishttp(menu.getPath())) {
            return error("地址必须以http(s)://开头");
        }
        if (!menuService.checkRouteConfigUnique(menu)) {
            return error("路由名称或地址已存在");
        }
        return toAjax(menuService.insertMenu(menu));
    }

    /**
     * 编辑菜单
     */
    @PreAuthorize("@ss.hasPermi('system:menu:edit')")
    @Log(title = "菜单管理", businessType = BusinessType.UPDATE, bizId = "#menu.menuId")
    @Operation(summary = "编辑菜单")
    @PostMapping("/update")
    public AjaxResult update(@Validated({ SysMenuSaveReq.Update.class, Default.class }) @RequestBody SysMenuSaveReq menu) {
        if (!menuService.checkMenuNameUnique(menu)) {
            return error("菜单名称已存在");
        }
        if (UserConstants.YES_FRAME.equals(menu.getIsFrame()) && !StringUtils.ishttp(menu.getPath())) {
            return error("地址必须以http(s)://开头");
        }
        if (!menuService.checkRouteConfigUnique(menu)) {
            return error("路由名称或地址已存在");
        }
        if (menu.getMenuId().equals(menu.getParentId())) {
            return error("上级菜单不能选择自己");
        }
        return toAjax(menuService.updateMenu(menu));
    }

    /**
     * 菜单详情
     */
    @PreAuthorize("@ss.hasPermi('system:menu:query')")
    @Operation(summary = "菜单详情")
    @GetMapping("/detail")
    public AjaxResult detail(@RequestParam Long menuId) {
        return success(menuService.selectMenuVoById(menuId));
    }

    /**
     * 删除菜单
     */
    @PreAuthorize("@ss.hasPermi('system:menu:remove')")
    @Log(title = "菜单管理", businessType = BusinessType.DELETE, bizId = "#menuId")
    @Operation(summary = "删除菜单")
    @GetMapping("/delete")
    public AjaxResult delete(@RequestParam Long menuId) {
        if (menuService.hasChildByMenuId(menuId)) {
            return warn("存在子菜单,不允许删除");
        }
        if (menuService.checkMenuExistRole(menuId)) {
            return warn("菜单已分配,不允许删除");
        }
        return toAjax(menuService.deleteMenuById(menuId));
    }
}
