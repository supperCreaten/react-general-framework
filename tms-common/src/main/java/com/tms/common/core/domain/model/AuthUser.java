package com.tms.common.core.domain.model;

import java.util.List;

/**
 * 登录用户读模型。具体数据在 tms-system 的用户 VO 中，避免 common 再依赖用户实体。
 */
public interface AuthUser {
    /** 用户ID */
    Long getUserId();

    /** 登录账号 */
    String getUserName();

    /** 昵称 */
    String getNickName();

    /** 密码密文 */
    String getPassword();

    /** 手机号码 */
    String getPhonenumber();

    /** 邮箱 */
    String getEmail();

    /** 性别 */
    String getSex();

    /** 删除标志（0存在 1删除） */
    String getDelFlag();

    /** 账号状态（0启用 1禁用） */
    String getStatus();

    /** 是否超级管理员 */
    boolean isAdmin();

    /** 用户所属角色 */
    List<? extends AuthRole> getRoles();

    /** 更新缓存中的昵称 */
    void setNickName(String nickName);

    /** 更新缓存中的邮箱 */
    void setEmail(String email);

    /** 更新缓存中的手机号 */
    void setPhonenumber(String phonenumber);

    /** 更新缓存中的性别 */
    void setSex(String sex);
}
