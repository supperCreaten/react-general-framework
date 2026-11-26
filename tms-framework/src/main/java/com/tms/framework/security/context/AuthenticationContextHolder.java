package com.tms.framework.security.context;

import org.springframework.security.core.Authentication;

/**
 * 身份验证信息
 * 
 * @author tms
 */
public class AuthenticationContextHolder
{
    private static final ThreadLocal<Authentication> contextHolder = new ThreadLocal<>();

    /**
     * 获取当前线程认证信息
     */
    public static Authentication getContext()
    {
        return contextHolder.get();
    }

    /**
     * 设置当前线程认证信息
     */
    public static void setContext(Authentication context)
    {
        contextHolder.set(context);
    }

    /**
     * 清除当前线程认证信息
     */
    public static void clearContext()
    {
        contextHolder.remove();
    }
}
