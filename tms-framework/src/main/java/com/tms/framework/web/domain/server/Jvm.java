package com.tms.framework.web.domain.server;

import java.lang.management.ManagementFactory;
import com.tms.common.utils.Arith;
import com.tms.common.utils.DateUtils;

/**
 * JVM相关信息
 * 
 * @author tms
 */
public class Jvm
{
    /**
     * 当前JVM占用的内存总数(M)
     */
    private double total;

    /**
     * JVM最大可用内存总数(M)
     */
    private double max;

    /**
     * JVM空闲内存(M)
     */
    private double free;

    /**
     * JDK版本
     */
    private String version;

    /**
     * JDK路径
     */
    private String home;

    /** 获取当前占用内存（MB） */
    public double getTotal()
    {
        return Arith.div(total, (1024 * 1024), 2);
    }

    /** 设置当前占用内存（字节） */
    public void setTotal(double total)
    {
        this.total = total;
    }

    /** 获取最大可用内存（MB） */
    public double getMax()
    {
        return Arith.div(max, (1024 * 1024), 2);
    }

    /** 设置最大可用内存（字节） */
    public void setMax(double max)
    {
        this.max = max;
    }

    /** 获取空闲内存（MB） */
    public double getFree()
    {
        return Arith.div(free, (1024 * 1024), 2);
    }

    /** 设置空闲内存（字节） */
    public void setFree(double free)
    {
        this.free = free;
    }

    /** 获取已用内存（MB） */
    public double getUsed()
    {
        return Arith.div(total - free, (1024 * 1024), 2);
    }

    /** 获取内存使用率（百分比） */
    public double getUsage()
    {
        return Arith.mul(Arith.div(total - free, total, 4), 100);
    }

    /**
     * 获取JDK名称
     */
    public String getName()
    {
        return ManagementFactory.getRuntimeMXBean().getVmName();
    }

    /** 获取JDK版本号 */
    public String getVersion()
    {
        return version;
    }

    /** 设置JDK版本号 */
    public void setVersion(String version)
    {
        this.version = version;
    }

    /** 获取JDK安装路径 */
    public String getHome()
    {
        return home;
    }

    /** 设置JDK安装路径 */
    public void setHome(String home)
    {
        this.home = home;
    }

    /**
     * JDK启动时间
     */
    public String getStartTime()
    {
        return DateUtils.parseDateToStr(DateUtils.YYYY_MM_DD_HH_MM_SS, DateUtils.getServerStartDate());
    }

    /**
     * JDK运行时间
     */
    public String getRunTime()
    {
        return DateUtils.timeDistance(DateUtils.getNowDate(), DateUtils.getServerStartDate());
    }

    /**
     * 运行参数
     */
    public String getInputArgs()
    {
        return ManagementFactory.getRuntimeMXBean().getInputArguments().toString();
    }
}