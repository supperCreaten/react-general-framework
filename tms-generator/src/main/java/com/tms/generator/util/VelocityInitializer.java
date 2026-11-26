package com.tms.generator.util;

import java.util.Properties;
import org.apache.velocity.app.Velocity;
import com.tms.common.constant.Constants;

/**
 * VelocityEngine工厂
 * 
 * @author tms
 */
public class VelocityInitializer
{
    /**
     * 初始化 Velocity 引擎（加载 classpath 模板）
     */
    public static void initVelocity()
    {
        Properties p = new Properties();
        try
        {
            // 加载classpath目录下的vm文件
            p.setProperty("resource.loader.file.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
            // 定义字符集
            p.setProperty(Velocity.INPUT_ENCODING, Constants.UTF8);
            // 初始化Velocity引擎，指定配置Properties
            Velocity.init(p);
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }
}
