package com.tms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

/**
 * 启动程序
 * 
 * @author tms
 */
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class TmsApplication
{
    public static void main(String[] args)
    {
        // System.setProperty("spring.devtools.restart.enabled", "false");
        SpringApplication.run(TmsApplication.class, args);
        System.out.println("(♥◠‿◠)ﾉﾞ  Tms启动成功   ლ(´ڡ`ლ)ﾞ  \n" +
                "  _______  __  __   _____  \n" +
                " |__   __||  \\/  | / ____| \n" +
                "    | |   | \\  / || (___   \n" +
                "    | |   | |\\/| | \\___ \\  \n" +
                "    | |   | |  | | ____) | \n" +
                "    |_|   |_|  |_||_____/  \n");
    }
}
