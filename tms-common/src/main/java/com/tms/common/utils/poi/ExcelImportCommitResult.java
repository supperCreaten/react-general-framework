package com.tms.common.utils.poi;

import lombok.Data;

/**
 * Excel 导入提交结果（供前端展示统计与下载错误日志）
 */
@Data
public class ExcelImportCommitResult {
    /** 总行数 */
    private int totalCount;

    /** 成功入库行数 */
    private int successCount;

    /** 失败行数 */
    private int failCount;

    /** 提示文案 */
    private String message;

    /** 错误文件下载名 */
    private String errorFileName;

    /** 错误文件 Base64（无失败时为空） */
    private String errorFileBase64;
}
