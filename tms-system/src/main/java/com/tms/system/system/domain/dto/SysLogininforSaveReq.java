package com.tms.system.system.domain.dto;

import lombok.Data;

/**
 * 登录日志新增参数
 */
@Data
public class SysLogininforSaveReq {
    /** 用户账号 */
    private String userName;

    /** 登录状态（0成功 1失败） */
    private String status;

    /** 登录IP地址 */
    private String ipaddr;

    /** 登录地点 */
    private String loginLocation;

    /** 浏览器类型 */
    private String browser;

    /** 操作系统 */
    private String os;

    /** User-Agent */
    private String userAgent;

    /** 客户端类型（web 管理端 / app 移动端） */
    private String clientType;

    /** 提示消息 */
    private String msg;
}
