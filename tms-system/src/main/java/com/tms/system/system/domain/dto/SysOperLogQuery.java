package com.tms.system.system.domain.dto;

import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 操作日志查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysOperLogQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 模块标题 */
    private String title;

    /** 业务类型 */
    private Integer businessType;

    /** 业务类型列表 */
    private List<Integer> businessTypes;

    /** 操作状态（0正常 1异常） */
    private Integer status;

    /** 操作人员 */
    private String operName;

    /** 主机地址 */
    private String operIp;

    /** 操作时间起 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date operTimeStart;

    /** 操作时间止 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date operTimeEnd;
}
