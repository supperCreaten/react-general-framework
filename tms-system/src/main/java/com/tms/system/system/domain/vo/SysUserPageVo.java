package com.tms.system.system.domain.vo;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.encrypt.SensitiveDataCrypto;
import lombok.Data;

/**
 * 用户分页列表返回。手机号脱敏，不返回密码与密文。
 */
@Data
public class SysUserPageVo {
    /** 用户ID */
    private Long userId;

    /** 登录账号 */
    private String account;

    /** 登录账号（与 account 一致，兼容列表列） */
    private String userName;

    /** 昵称 */
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
    private String email;

    /** 手机号码（脱敏） */
    private String phone;

    /** 手机号码（脱敏，兼容 phonenumber） */
    private String phonenumber;

    /** 用户性别 */
    private String sex;

    /** 账号状态（0启用 1禁用） */
    private String status;

    /** 角色名称 */
    private String roleName;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    public static SysUserPageVo from(SysUserVo user) {
        SysUserPageVo vo = new SysUserPageVo();
        if (user == null) {
            return vo;
        }
        vo.setUserId(user.getUserId());
        String account = StringUtils.isNotEmpty(user.getAccount()) ? user.getAccount() : user.getUserName();
        vo.setAccount(account);
        vo.setUserName(account);
        vo.setNickName(user.getNickName());
        vo.setDeptId(user.getDeptId());
        vo.setDeptName(user.getDeptName());
        vo.setPostId(user.getPostId());
        vo.setPostName(user.getPostName());
        vo.setEmail(user.getEmail());
        if (StringUtils.isNotEmpty(user.getPhonenumber())) {
            String phone = SensitiveDataCrypto.desensitizePhone(user.getPhonenumber());
            vo.setPhone(phone);
            vo.setPhonenumber(phone);
        }
        vo.setSex(user.getSex());
        vo.setStatus(user.getStatus());
        vo.setRoleName(user.getRoleName());
        vo.setCreateTime(user.getCreateTime());
        return vo;
    }
}
