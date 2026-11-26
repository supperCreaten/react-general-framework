package com.tms.system.system.controller;

import java.util.Set;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import com.tms.common.core.domain.AjaxResult;
import com.tms.system.system.domain.vo.SysRoleVo;
import com.tms.system.system.domain.vo.SysUserVo;
import com.tms.common.core.domain.model.LoginBody;
import com.tms.common.utils.SecurityUtils;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.sign.AesUtils;
import com.tms.common.core.service.ISysLoginService;
import com.tms.system.system.domain.vo.UserInfoVo;
import com.tms.system.system.service.ISysUserService;
import com.tms.system.system.service.SysPermissionService;

/**
 * 登录认证（对齐 server /login、/refreshToken、/userInfo、/authRoutes）
 *
 * @author tms
 */
@RestController
@Tag(name = "登录认证")
public class SysLoginController {
    @Autowired
    private ISysLoginService loginService;

    @Autowired
    private ISysUserService userService;

    @Autowired
    private SysPermissionService permissionService;

    /**
     * 登录
     */
    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public AjaxResult login(@RequestBody LoginBody loginBody, HttpServletResponse response) {
        String account = AesUtils.decrypt(loginBody.getAccount());
        String password = AesUtils.decrypt(loginBody.getPassword());
        if (StringUtils.isEmpty(account)) {
            return AjaxResult.error("账号不能为空");
        }
        String token = loginService.login(account, password, response);
        // token 是 String，必须走 success(msg, data)，否则会命中 success(String msg) 把 JWT 写进 msg
        return AjaxResult.success("操作成功", token);
    }


    /**
     * 当前登录用户信息（对齐若依 getInfo：data = { permissions, roles, user }）
     */
    @Operation(summary = "当前登录用户信息")
    @GetMapping("/userInfo")
    public AjaxResult userInfo() {
        SysUserVo user = userService.selectUserById(SecurityUtils.getUserId());
        if (user == null) {
            return AjaxResult.error("用户不存在");
        }
        // 扁平化角色：取首个 roleId，roleName 逗号拼接（个人中心等仍依赖）
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            user.setRoleId(user.getRoles().get(0).getRoleId());
            user.setRoleName(user.getRoles().stream()
                    .map(SysRoleVo::getRoleName)
                    .filter(StringUtils::isNotEmpty)
                    .collect(Collectors.joining(",")));
        }
        Set<String> roles = permissionService.getRolePermission(user);
        Set<String> permissions = permissionService.getMenuPermission(user);

        UserInfoVo info = new UserInfoVo();
        info.setPermissions(permissions);
        info.setRoles(roles);
        info.setUser(user);
        return AjaxResult.success(info);
    }

}

