package com.tms.system.system.domain.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.tms.common.core.domain.BaseEntity;
import com.tms.system.system.domain.vo.SysUserVo;
import com.tms.common.xss.Xss;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户新增/修改参数。必填与前端用户表单一致：昵称、归属部门、手机号、账号、岗位；密码仅新增必填。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysUserSaveReq extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 新增校验组 */
    public interface Create {
    }

    /** 修改校验组 */
    public interface Update {
    }

    /** 用户ID（修改时必填） */
    @NotNull(message = "用户ID不能为空", groups = Update.class)
    private Long userId;

    /** 昵称 */
    @Xss(message = "用户昵称不能包含脚本字符")
    @NotBlank(message = "昵称不能为空")
    @Size(max = 30, message = "用户昵称长度不能超过30个字符")
    private String nickName;

    /** 归属部门 */
    @NotBlank(message = "归属部门不能为空")
    private String deptId;

    /** 手机号码 */
    @NotBlank(message = "手机号码不能为空")
    @Pattern(regexp = "^1\\d{10}$", message = "请输入正确的手机号码")
    @JsonAlias({ "phonenumber", "phone" })
    private String phone;

    /** 邮箱 */
    @Email(message = "邮箱格式不正确")
    @Size(max = 50, message = "邮箱长度不能超过50个字符")
    private String email;

    /** 登录账号 */
    @Xss(message = "用户账号不能包含脚本字符")
    @NotBlank(message = "账号不能为空")
    @Size(max = 30, message = "用户账号长度不能超过30个字符")
    @JsonAlias({ "userName", "account" })
    private String account;

    /** 用户密码（新增必填，修改留空则不改） */
    @NotBlank(message = "用户密码不能为空", groups = Create.class)
    @Size(min = 6, max = 20, message = "密码长度必须在6到20个字符之间")
    private String password;

    /** 用户性别 */
    private String sex;

    /** 账号状态（0启用 1禁用） */
    private String status;

    /** 岗位 */
    @NotBlank(message = "岗位不能为空")
    private String postId;

    /** 角色组 */
    private Long[] roleIds;

    /** 转成持久化使用的用户对象。登录账号同时写入 account 与 userName */
    public SysUserVo toEntity() {
        SysUserVo user = new SysUserVo();
        user.setUserId(userId);
        user.setNickName(nickName);
        user.setDeptId(deptId);
        user.setPhonenumber(phone);
        user.setEmail(email);
        user.setAccount(account);
        user.setUserName(account);
        user.setPassword(password);
        user.setSex(sex);
        user.setStatus(status);
        user.setPostId(postId);
        user.setRoleIds(roleIds);
        user.setRemark(getRemark());
        user.setCreateBy(getCreateBy());
        user.setUpdateBy(getUpdateBy());
        return user;
    }
}
