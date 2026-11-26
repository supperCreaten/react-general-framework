package com.tms.system.system.domain.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.tms.common.core.domain.BaseEntity;
import com.tms.system.system.domain.vo.SysUserVo;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户列表查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysUserQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 用户ID */
    private Long userId;

    /** 登录账号 */
    @JsonAlias({ "userName", "account" })
    private String account;

    /** 登录账号（兼容旧查询字段） */
    private String userName;

    /** 昵称 */
    private String nickName;

    /** 手机号码 */
    @JsonAlias({ "phone", "phonenumber" })
    private String phonenumber;

    /** 部门ID（含下级） */
    private String deptId;

    /** 账号状态（0启用 1禁用） */
    private String status;

    /** 角色ID（已分配用户查询） */
    private Long roleId;

    /** 员工工号 */
    private String employeeNo;

    /** 学历 */
    private String education;

    /** 身份证号 */
    private String idCard;

    /** 转成查询用的用户对象。未传 userName 时用登录账号 */
    public SysUserVo toEntity() {
        SysUserVo user = new SysUserVo();
        user.setUserId(userId);
        user.setAccount(account);
        user.setUserName(userName != null ? userName : account);
        user.setNickName(nickName);
        user.setPhonenumber(phonenumber);
        user.setDeptId(deptId);
        user.setStatus(status);
        user.setRoleId(roleId);
        user.setEmployeeNo(employeeNo);
        user.setEducation(education);
        user.setIdCard(idCard);
        return user;
    }
}
