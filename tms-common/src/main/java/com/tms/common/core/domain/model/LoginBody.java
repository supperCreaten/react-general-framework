package com.tms.common.core.domain.model;

import lombok.Data;

/**
 * 用户登录对象（对齐前端 /api/login：account + password）
 *
 * @author tms
 */
@Data
public class LoginBody
{
    /** 登录账号（前端字段 account，可能为 AES 密文） */
    private String account;

    /** 兼容旧字段 username */
    private String username;

    /** 用户密码（可能为 AES 密文） */
    private String password;

    public String getAccount()
    {
        return account != null ? account : username;
    }

    public String getUsername()
    {
        return username != null ? username : account;
    }
}
