package com.tms.common.core.service;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Login service abstraction. Implemented in framework.
 *
 * @author tms
 */
public interface ISysLoginService
{
    String login(String username, String password);

    /**
     * 登录并写入 refreshToken Cookie（对齐 server）
     */
    String login(String username, String password, HttpServletResponse response);
}
