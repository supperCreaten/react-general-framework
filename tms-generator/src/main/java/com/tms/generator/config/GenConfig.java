package com.tms.generator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

/**
 * 读取代码生成相关配置
 * 
 * @author tms
 */
@Component
@ConfigurationProperties(prefix = "gen")
@PropertySource(value = { "classpath:generator.yml" })
public class GenConfig
{
    /** 作者 */
    public static String author;

    /** 生成包路径 */
    public static String packageName;

    /** 自动去除表前缀 */
    public static boolean autoRemovePre;

    /** 表前缀 */
    public static String tablePrefix;

    /** 是否允许生成文件覆盖到本地（自定义路径） */
    public static boolean allowOverwrite;

    /** 获取代码生成作者 */
    public static String getAuthor()
    {
        return author;
    }

    /**
     * 设置代码生成作者
     *
     * @param author 作者名
     */
    @Value("${author}")
    public void setAuthor(String author)
    {
        GenConfig.author = author;
    }

    /** 获取生成代码包路径 */
    public static String getPackageName()
    {
        return packageName;
    }

    /**
     * 设置生成代码包路径
     *
     * @param packageName 包路径
     */
    @Value("${packageName}")
    public void setPackageName(String packageName)
    {
        GenConfig.packageName = packageName;
    }

    /** 是否自动去除表前缀 */
    public static boolean getAutoRemovePre()
    {
        return autoRemovePre;
    }

    /**
     * 设置是否自动去除表前缀
     *
     * @param autoRemovePre 是否去除
     */
    @Value("${autoRemovePre}")
    public void setAutoRemovePre(boolean autoRemovePre)
    {
        GenConfig.autoRemovePre = autoRemovePre;
    }

    /** 获取表名前缀 */
    public static String getTablePrefix()
    {
        return tablePrefix;
    }

    /**
     * 设置表名前缀
     *
     * @param tablePrefix 前缀，多个以逗号分隔
     */
    @Value("${tablePrefix}")
    public void setTablePrefix(String tablePrefix)
    {
        GenConfig.tablePrefix = tablePrefix;
    }

    /** 是否允许覆盖本地已存在生成文件 */
    public static boolean isAllowOverwrite()
    {
        return allowOverwrite;
    }

    /**
     * 设置是否允许覆盖本地生成文件
     *
     * @param allowOverwrite 是否允许
     */
    @Value("${allowOverwrite}")
    public void setAllowOverwrite(boolean allowOverwrite)
    {
        GenConfig.allowOverwrite = allowOverwrite;
    }
}
