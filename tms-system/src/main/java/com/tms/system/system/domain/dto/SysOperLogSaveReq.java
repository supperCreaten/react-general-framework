package com.tms.system.system.domain.dto;

import lombok.Data;

/**
 * 操作日志新增参数
 */
@Data
public class SysOperLogSaveReq {
    /** 模块标题 */
    private String title;

    /** 业务类型 */
    private Integer businessType;

    /** 方法名称 */
    private String method;

    /** 请求方式 */
    private String requestMethod;

    /** 操作类别 */
    private Integer operatorType;

    /** 操作人员 */
    private String operName;

    /** 部门名称 */
    private String deptName;

    /** 请求URL */
    private String operUrl;

    /** 主机地址 */
    private String operIp;

    /** 操作地点 */
    private String operLocation;

    /** 请求参数 */
    private String operParam;

    /** 返回参数 */
    private String jsonResult;

    /** 字段变更 JSON */
    private String changeDiff;

    /** 操作状态（0正常 1异常） */
    private Integer status;

    /** 错误消息 */
    private String errorMsg;

    /** 消耗时间 */
    private Long costTime;

    /** User-Agent */
    private String userAgent;
}
