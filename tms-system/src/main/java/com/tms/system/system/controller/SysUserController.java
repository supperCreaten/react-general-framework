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
import org.springframework.web.multipart.MultipartFile;
import com.tms.common.annotation.Log;
import com.tms.common.core.controller.BaseController;
import com.tms.common.core.domain.AjaxResult;
import com.tms.system.system.domain.vo.SysUserVo;
import com.tms.common.enums.BusinessType;
import com.tms.common.utils.SecurityUtils;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.sign.AesUtils;
import com.tms.system.system.domain.dto.SysUserAuthRoleReq;
import com.tms.system.system.domain.dto.SysUserQuery;
import com.tms.system.system.domain.dto.SysUserResetPwdReq;
import com.tms.system.system.domain.dto.SysUserSaveReq;
import com.tms.system.system.domain.dto.SysUserStatusReq;
import com.tms.system.system.domain.vo.SysUserPageVo;
import com.tms.system.system.service.ISysUserService;
import jakarta.validation.groups.Default;

/**
 * 用户管理（对齐 server /api/user，无重复接口）
 *
 * @author tms
 */
@RestController
@Tag(name = "用户管理")
@RequestMapping("/user")
public class SysUserController extends BaseController
{
    @Autowired
    private ISysUserService userService;

    /** 用户分页列表 */
    @PreAuthorize("@ss.hasPermi('system:user:list')")
    @Operation(summary = "用户分页列表")
    @PostMapping("/pageQuery")
    public AjaxResult pageQuery(@RequestBody(required = false) SysUserQuery query)
    {
        startPage();
        List<SysUserPageVo> list = userService.selectUserList(query);
        return getDataTable(list);
    }

    /** 用户详情 */
    @PreAuthorize("@ss.hasPermi('system:user:query')")
    @Operation(summary = "用户详情")
    @GetMapping("/detail")
    public AjaxResult detail(@RequestParam Long userId)
    {
        return success(userService.selectUserVoById(userId));
    }

    /** 新增用户 */
    @PreAuthorize("@ss.hasPermi('system:user:edit')")
    @Log(title = "用户管理", businessType = BusinessType.INSERT)
    @Operation(summary = "新增用户")
    @PostMapping("/insert")
    public AjaxResult insert(@Validated({ SysUserSaveReq.Create.class, Default.class }) @RequestBody SysUserSaveReq user)
    {
        if (!userService.checkUserNameUnique(user))
        {
            return error("登录账号已存在");
        }
        if (StringUtils.isNotEmpty(user.getPhone()) && !userService.checkPhoneUnique(user))
        {
            return error("手机号码已存在");
        }
        if (StringUtils.isNotEmpty(user.getEmail()) && !userService.checkEmailUnique(user))
        {
            return error("邮箱账号已存在");
        }
        return toAjax(userService.insertUser(user));
    }

    /** 编辑用户 */
    @PreAuthorize("@ss.hasPermi('system:user:edit')")
    @Log(title = "用户管理", businessType = BusinessType.UPDATE, bizId = "#user.userId")
    @Operation(summary = "编辑用户")
    @PostMapping("/update")
    public AjaxResult update(@Validated({ SysUserSaveReq.Update.class, Default.class }) @RequestBody SysUserSaveReq user)
    {
        if (!userService.checkUserNameUnique(user))
        {
            return error("登录账号已存在");
        }
        if (StringUtils.isNotEmpty(user.getPhone()) && !userService.checkPhoneUnique(user))
        {
            return error("手机号码已存在");
        }
        if (StringUtils.isNotEmpty(user.getEmail()) && !userService.checkEmailUnique(user))
        {
            return error("邮箱账号已存在");
        }
        return toAjax(userService.updateUser(user));
    }

    /** 更新状态 */
    @PreAuthorize("@ss.hasPermi('system:user:edit')")
    @Log(title = "用户管理", businessType = BusinessType.UPDATE, bizId = "#user.userId")
    @Operation(summary = "更新用户状态")
    @PostMapping("/updateStatus")
    public AjaxResult updateStatus(@Validated @RequestBody SysUserStatusReq user)
    {
        return toAjax(userService.updateUserStatus(user));
    }

    /** 重置密码 */
    @PreAuthorize("@ss.hasPermi('system:user:resetPwd')")
    @Log(title = "用户管理", businessType = BusinessType.UPDATE, bizId = "#user.userId")
    @Operation(summary = "重置用户密码")
    @PostMapping("/resetPassword")
    public AjaxResult resetPassword(@Validated @RequestBody SysUserResetPwdReq user)
    {
        return toAjax(userService.resetPwd(user));
    }

    /** 删除用户 */
    @PreAuthorize("@ss.hasPermi('system:user:remove')")
    @Log(title = "用户管理", businessType = BusinessType.DELETE, bizId = "#userId")
    @Operation(summary = "删除用户")
    @GetMapping("/delete")
    public AjaxResult delete(@RequestParam Long userId)
    {
        userService.checkUserAllowed(userId);
        return toAjax(userService.deleteUserById(userId));
    }

    /** 用户授权角色 */
    @PreAuthorize("@ss.hasPermi('system:user:edit')")
    @Log(title = "用户管理", businessType = BusinessType.GRANT, bizId = "#user.userId")
    @Operation(summary = "用户授权角色")
    @PostMapping("/authRole")
    public AjaxResult authRole(@Validated @RequestBody SysUserAuthRoleReq user)
    {
        userService.insertUserAuth(user);
        return success();
    }

    /** 忘记密码 / 改密（对齐 server POST /api/user/changePassword） */
    @Log(title = "用户管理", businessType = BusinessType.UPDATE, excludeParamNames = { "password", "account" })
    @Operation(summary = "按账号修改密码")
    @PostMapping("/changePassword")
    public AjaxResult changePassword(@RequestBody java.util.Map<String, Object> body)
    {
        String accountCipher = body.get("account") != null ? String.valueOf(body.get("account")) : "";
        String passwordCipher = body.get("password") != null ? String.valueOf(body.get("password")) : "";
        if (StringUtils.isEmpty(accountCipher) || StringUtils.isEmpty(passwordCipher))
        {
            return error("参数不完整");
        }
        String account = AesUtils.decrypt(accountCipher);
        String password = AesUtils.decrypt(passwordCipher);
        if (StringUtils.isEmpty(account))
        {
            return error("账号不能为空");
        }
        if (password == null || password.length() < 6)
        {
            return error("密码至少6位");
        }
        SysUserVo user = userService.selectUserByUserName(account);
        if (user == null)
        {
            return error("账号不存在");
        }
        SysUserVo update = new SysUserVo();
        update.setUserId(user.getUserId());
        update.setPassword(SecurityUtils.encryptPassword(password));
        return toAjax(userService.resetPwd(update));
    }

    /** 上传头像 */
    @Log(title = "用户头像", businessType = BusinessType.UPDATE, bizId = "#loginUserId")
    @Operation(summary = "上传用户头像")
    @PostMapping("/avatar")
    public AjaxResult avatar(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "full", required = false) MultipartFile full) throws Exception
    {
        if (file.isEmpty())
        {
            return error("上传文件不能为空");
        }
        String avatar = java.util.Base64.getEncoder().encodeToString(file.getBytes());
        String fullAvatar = null;
        if (full != null && !full.isEmpty())
        {
            fullAvatar = java.util.Base64.getEncoder().encodeToString(full.getBytes());
        }
        if (userService.updateUserAvatar(getUserId(), avatar, fullAvatar))
        {
            AjaxResult ajax = AjaxResult.success();
            ajax.put("imgUrl", avatar);
            if (fullAvatar != null)
            {
                ajax.put("fullAvatar", fullAvatar);
            }
            return ajax;
        }
        return error("上传图片异常");
    }
}
