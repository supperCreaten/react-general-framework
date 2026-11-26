package com.tms;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * web容器中进行部署
 * 
 * @author tms
 */
public class TmsServletInitializer extends SpringBootServletInitializer
{
    /**
     * 配置 Spring Boot 应用源（WAR 部署）
     *
     * @param application 应用构建器
     * @return 配置后的构建器
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application)
    {
        return application.sources(TmsApplication.class);
    }
}
