package com.tms.system.system.domain.dto;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 登录日志查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysLogininforQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 用户账号 */
    private String userName;

    /** 登录状态（0成功 1失败） */
    private String status;

    /** 登录IP地址 */
    private String ipaddr;

    /** 客户端类型（web 管理端 / app 移动端） */
    private String clientType;

    /** 访问时间起 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date loginTimeStart;

    /** 访问时间止 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date loginTimeEnd;
}
