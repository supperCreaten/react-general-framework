package com.tms.system.system.domain.vo;

import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tms.common.annotation.Excel;
import com.tms.common.annotation.Excel.ColumnType;
import com.tms.common.annotation.Excel.Type;
import com.tms.common.core.domain.model.AuthUser;
import com.tms.common.utils.SecurityUtils;
import com.tms.common.xss.Xss;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户数据对象。管理接口、登录和持久化都使用它。
 */
@Data
@NoArgsConstructor
public class SysUserVo implements AuthUser {
    /** 用户ID */
    @Excel(name = "用户序号", type = Type.EXPORT, cellType = ColumnType.NUMERIC, prompt = "用户编号")
    private Long userId;

    /** 登录账号，对应 sys_user.account */
    @Excel(name = "登录名称")
    private String account;

    /** 登录账号。与 account 同步，兼容旧字段 userName */
    @Xss(message = "用户账号不能包含脚本字符")
    @NotBlank(message = "用户账号不能为空")
    @Size(max = 30, message = "用户账号长度不能超过30个字符")
    private String userName;

    /** 昵称，对应 sys_user.user_name */
    @Excel(name = "用户名称")
    @Xss(message = "用户昵称不能包含脚本字符")
    @Size(max = 30, message = "用户昵称长度不能超过30个字符")
    private String nickName;

    /** 部门ID */
    private String deptId;

    /** 部门名称 */
    private String deptName;

    /** 岗位ID */
    private String postId;

    /** 岗位名称 */
    private String postName;

    /** 邮箱 */
    @Excel(name = "用户邮箱")
    @Email(message = "邮箱格式不正确")
    @Size(max = 50, message = "邮箱长度不能超过50个字符")
    private String email;

    /** 手机号码。JSON 名称为 phone，同时接受 phonenumber */
    @Excel(name = "手机号码", cellType = ColumnType.TEXT)
    @JsonProperty("phone")
    @JsonAlias({ "phonenumber", "phone" })
    @Size(max = 11, message = "手机号码长度不能超过11个字符")
    private String phonenumber;

    /** 性别 */
    @Excel(name = "用户性别")
    private String sex;

    /** 年龄 */
    private Integer age;

    /** 地址 */
    private String address;

    /** 员工工号 */
    private String employeeNo;

    /** 身份证号 */
    @Size(max = 18, message = "身份证号长度不能超过18个字符")
    private String idCard;

    /** 学历 */
    private String education;

    /** 手机号密文，不返回前端 */
    @JsonIgnore
    private String phoneCipher;

    /** 手机号密钥，不返回前端 */
    @JsonIgnore
    private String phoneSecretKey;

    /** 身份证密文，不返回前端 */
    @JsonIgnore
    private String idCardCipher;

    /** 身份证密钥，不返回前端 */
    @JsonIgnore
    private String idCardSecretKey;

    /** 头像 */
    private String avatar;

    /** 完整头像 */
    private String fullAvatar;

    /** 角色名称（多个以逗号分隔） */
    private String roleName;

    /** 密码。只接收不返回 */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    /** 账号状态（0启用 1禁用） */
    @Excel(name = "账号状态", readConverterExp = "0=启用,1=禁用")
    private String status;

    /** 删除标志（0存在 1删除），对应 is_del */
    private String isDel;

    /** 删除标志，与 isDel 相同，供登录校验读取 */
    private String delFlag;

    /** 最后登录IP */
    @Excel(name = "最后登录IP", type = Type.EXPORT)
    private String loginIp;

    /** 最后登录时间 */
    @Excel(name = "最后登录时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss", type = Type.EXPORT)
    private Date loginDate;

    /** 密码最后更新时间 */
    private Date pwdUpdateDate;

    /** 用户所属角色 */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<SysRoleVo> roles;

    /** 角色ID组 */
    private Long[] roleIds;

    /** 当前角色ID（取角色列表中的第一个） */
    private Long roleId;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /** 更新者 */
    private String updateBy;

    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /** 备注 */
    private String remark;

    public SysUserVo(Long userId) {
        this.userId = userId;
    }

    /**
     * 是否超级管理员（用户ID为 1）
     */
    @Override
    public boolean isAdmin() {
        return SecurityUtils.isAdmin(this.userId);
    }
}
