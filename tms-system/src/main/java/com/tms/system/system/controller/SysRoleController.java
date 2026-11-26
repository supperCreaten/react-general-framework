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
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import com.tms.common.annotation.Log;
import com.tms.common.core.controller.BaseController;
import com.tms.common.core.domain.AjaxResult;
import com.tms.common.core.domain.model.LoginUser;
import com.tms.common.enums.BusinessType;
import com.tms.common.utils.StringUtils;
import com.tms.common.core.service.ITokenService;
import com.tms.system.system.domain.dto.SysRoleMenuReq;
import com.tms.system.system.domain.dto.SysRoleQuery;
import com.tms.system.system.domain.dto.SysRoleSaveReq;
import com.tms.system.system.domain.dto.SysRoleStatusReq;
import com.tms.system.system.domain.dto.SysRoleUserReq;
import com.tms.system.system.domain.dto.SysUserQuery;
import com.tms.system.system.domain.vo.SysRoleVo;
import com.tms.system.system.domain.vo.SysUserPageVo;
import com.tms.system.system.domain.vo.SysUserVo;
import com.tms.system.system.service.SysPermissionService;
import jakarta.validation.groups.Default;
import com.tms.system.system.service.ISysMenuService;
import com.tms.system.system.service.ISysRoleService;
import com.tms.system.system.service.ISysUserService;

/**
 * 角色管理（对齐 server /api/role，无重复接口）
 *
 * @author tms
 */
@RestController
@Tag(name = "角色管理")
@RequestMapping("/role")
public class SysRoleController extends BaseController
{
    @Autowired
    private ISysRoleService roleService;

    @Autowired
    private ISysMenuService menuService;

    @Autowired
    private ISysUserService userService;

    @Autowired
    private ITokenService tokenService;

    @Autowired
    private SysPermissionService permissionService;

    /** 角色分页列表 */
    @PreAuthorize("@ss.hasPermi('system:role:list')")
    @Operation(summary = "角色分页列表")
    @PostMapping("/pageQuery")
    public AjaxResult pageQuery(@RequestBody(required = false) SysRoleQuery query)
    {
        startPage();
        List<SysRoleVo> list = roleService.selectRoleVoList(query);
        return getDataTable(list);
    }

    /** 新增角色 */
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.INSERT)
    @Operation(summary = "新增角色")
    @PostMapping("/insert")
    public AjaxResult insert(@Validated @RequestBody SysRoleSaveReq role)
    {
        if (!roleService.checkRoleNameUnique(role))
        {
            return error("角色名称已存在");
        }
        if (!roleService.checkRoleKeyUnique(role))
        {
            return error("权限字符已存在");
        }
        if (!roleService.checkRoleCodeUnique(role))
        {
            return error("角色编码已存在");
        }
        return toAjax(roleService.insertRole(role));
    }

    /** 编辑角色 */
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.UPDATE, bizId = "#role.roleId")
    @Operation(summary = "编辑角色")
    @PostMapping("/update")
    public AjaxResult update(@Validated({ SysRoleSaveReq.Update.class, Default.class }) @RequestBody SysRoleSaveReq role)
    {
        if (!roleService.checkRoleNameUnique(role))
        {
            return error("角色名称已存在");
        }
        if (!roleService.checkRoleKeyUnique(role))
        {
            return error("权限字符已存在");
        }
        if (!roleService.checkRoleCodeUnique(role))
        {
            return error("角色编码已存在");
        }
        if (roleService.updateRole(role) > 0)
        {
            refreshLoginUserCache();
            return success();
        }
        return error("修改角色失败");
    }

    /** 角色详情 */
    @PreAuthorize("@ss.hasPermi('system:role:query')")
    @Operation(summary = "角色详情")
    @GetMapping("/detail")
    public AjaxResult detail(@RequestParam Long roleId)
    {
        return success(roleService.selectRoleVoById(roleId));
    }

    /** 更新角色状态 */
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.UPDATE, bizId = "#role.roleId")
    @Operation(summary = "更新角色状态")
    @PostMapping("/updateStatus")
    public AjaxResult updateStatus(@Validated @RequestBody SysRoleStatusReq role)
    {
        return toAjax(roleService.updateRoleStatus(role));
    }

    /** 角色已分配菜单 */
    @PreAuthorize("@ss.hasPermi('system:role:query')")
    @Operation(summary = "查询角色菜单")
    @GetMapping("/roleToMenu")
    public AjaxResult roleToMenu(@RequestParam Long roleId)
    {
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("checkedKeys", menuService.selectMenuListByRoleId(roleId));
        data.put("menus", menuService.buildMenuTreeSelect(menuService.selectMenuList(getUserId())));
        return success(data);
    }

    /** 保存角色菜单 */
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.GRANT, bizId = "#role.roleId")
    @Operation(summary = "保存角色菜单")
    @PostMapping("/saveMenuToRole")
    public AjaxResult saveMenuToRole(@Validated @RequestBody SysRoleMenuReq role)
    {
        return toAjax(roleService.saveRoleMenu(role));
    }

    /** 角色已分配用户 */
    @PreAuthorize("@ss.hasPermi('system:role:list')")
    @Operation(summary = "查询角色用户")
    @GetMapping("/roleToUser")
    public AjaxResult roleToUser(@RequestParam Long roleId)
    {
        startPage();
        SysUserQuery query = new SysUserQuery();
        query.setRoleId(roleId);
        List<SysUserPageVo> list = userService.selectAllocatedList(query);
        return getDataTable(list);
    }

    /** 保存角色用户 */
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.GRANT, bizId = "#body['roleId']")
    @Operation(summary = "保存角色用户")
    @PostMapping("/saveUserToRole")
    public AjaxResult saveUserToRole(@Validated @RequestBody SysRoleUserReq req)
    {
        return toAjax(roleService.insertAuthUsers(req.getRoleId(), req.toUserIdArray()));
    }

    /** 取消角色用户授权 */
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.GRANT, bizId = "#body['roleId']")
    @Operation(summary = "取消角色用户")
    @PostMapping("/cancelUserToRole")
    public AjaxResult cancelUserToRole(@Validated @RequestBody SysRoleUserReq req)
    {
        return toAjax(roleService.deleteAuthUsers(req.getRoleId(), req.toUserIdArray()));
    }

    /** 删除角色 */
    @PreAuthorize("@ss.hasPermi('system:role:remove')")
    @Log(title = "角色管理", businessType = BusinessType.DELETE, bizId = "#roleId")
    @Operation(summary = "删除角色")
    @GetMapping("/delete")
    public AjaxResult delete(@RequestParam Long roleId)
    {
        return toAjax(roleService.deleteRoleByIds(new Long[] { roleId }));
    }

    private void refreshLoginUserCache()
    {
        LoginUser loginUser = getLoginUser();
        if (StringUtils.isNotNull(loginUser.getUser()) && !loginUser.getUser().isAdmin())
        {
            SysUserVo user = userService.selectUserByUserName(loginUser.getUser().getUserName());
            loginUser.setUser(user);
            loginUser.setPermissions(permissionService.getMenuPermission(user));
            tokenService.setLoginUser(loginUser);
        }
    }

}
