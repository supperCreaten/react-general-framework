package com.tms.common.utils;

/**
 * 处理并记录日志文件
 * 
 * @author tms
 */
public class LogUtils
{
    /**
     * 获取处理并记录日志文件 * * @author tms
     */
    public static String getBlock(Object msg)
    {
        if (msg == null)
        {
            msg = "";
        }
        return "[" + msg.toString() + "]";
    }
}
