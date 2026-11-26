package com.tms.framework.web.domain.server;

import com.tms.common.utils.Arith;

/**
 * 內存相关信息
 * 
 * @author tms
 */
public class Mem
{
    /**
     * 内存总量
     */
    private double total;

    /**
     * 已用内存
     */
    private double used;

    /**
     * 剩余内存
     */
    private double free;

    /** 获取内存总量（GB） */
    public double getTotal()
    {
        return Arith.div(total, (1024 * 1024 * 1024), 2);
    }

    /** 设置内存总量（字节） */
    public void setTotal(long total)
    {
        this.total = total;
    }

    /** 获取已用内存（GB） */
    public double getUsed()
    {
        return Arith.div(used, (1024 * 1024 * 1024), 2);
    }

    /** 设置已用内存（字节） */
    public void setUsed(long used)
    {
        this.used = used;
    }

    /** 获取剩余内存（GB） */
    public double getFree()
    {
        return Arith.div(free, (1024 * 1024 * 1024), 2);
    }

    /** 设置剩余内存（字节） */
    public void setFree(long free)
    {
        this.free = free;
    }

    /** 获取内存使用率（百分比） */
    public double getUsage()
    {
        return Arith.mul(Arith.div(used, total, 4), 100);
    }
}