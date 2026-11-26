package com.tms.framework.web.domain.server;

import com.tms.common.utils.Arith;

/**
 * CPU相关信息
 * 
 * @author tms
 */
public class Cpu
{
    /**
     * 核心数
     */
    private int cpuNum;

    /**
     * CPU总的使用率
     */
    private double total;

    /**
     * CPU系统使用率
     */
    private double sys;

    /**
     * CPU用户使用率
     */
    private double used;

    /**
     * CPU当前等待率
     */
    private double wait;

    /**
     * CPU当前空闲率
     */
    private double free;

    /** 获取核心数 */
    public int getCpuNum()
    {
        return cpuNum;
    }

    /** 设置核心数 */
    public void setCpuNum(int cpuNum)
    {
        this.cpuNum = cpuNum;
    }

    /** 获取CPU总使用率（百分比） */
    public double getTotal()
    {
        return Arith.round(Arith.mul(total, 100), 2);
    }

    /** 设置CPU总使用率原始值 */
    public void setTotal(double total)
    {
        this.total = total;
    }

    /** 获取CPU系统使用率（百分比） */
    public double getSys()
    {
        return Arith.round(Arith.mul(sys / total, 100), 2);
    }

    /** 设置CPU系统使用率原始值 */
    public void setSys(double sys)
    {
        this.sys = sys;
    }

    /** 获取CPU用户使用率（百分比） */
    public double getUsed()
    {
        return Arith.round(Arith.mul(used / total, 100), 2);
    }

    /** 设置CPU用户使用率原始值 */
    public void setUsed(double used)
    {
        this.used = used;
    }

    /** 获取CPU等待率（百分比） */
    public double getWait()
    {
        return Arith.round(Arith.mul(wait / total, 100), 2);
    }

    /** 设置CPU等待率原始值 */
    public void setWait(double wait)
    {
        this.wait = wait;
    }

    /** 获取CPU空闲率（百分比） */
    public double getFree()
    {
        return Arith.round(Arith.mul(free / total, 100), 2);
    }

    /** 设置CPU空闲率原始值 */
    public void setFree(double free)
    {
        this.free = free;
    }
}