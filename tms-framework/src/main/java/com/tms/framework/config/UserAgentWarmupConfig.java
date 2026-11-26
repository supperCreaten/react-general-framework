package com.tms.framework.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import com.tms.common.utils.http.UserAgentUtils;

/**
 * 启动时预热 YAUAA。登录发牌已改走正则解析，这里只让异步登录日志避开首次规则加载。
 *
 * @author tms
 */
@Component
public class UserAgentWarmupConfig
{
    private static final Logger log = LoggerFactory.getLogger(UserAgentWarmupConfig.class);

    private static final String SAMPLE_UA =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    /**
     * 启动时预热 User-Agent 解析器
     */
    @PostConstruct
    public void warmUp()
    {
        long start = System.currentTimeMillis();
        UserAgentUtils.getBrowser(SAMPLE_UA);
        UserAgentUtils.getOperatingSystem(SAMPLE_UA);
        log.info("UserAgent analyzer warmed up in {} ms", System.currentTimeMillis() - start);
    }
}
