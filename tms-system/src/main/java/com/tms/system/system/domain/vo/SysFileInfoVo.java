package com.tms.system.system.domain.vo;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * 上传文件查询结果
 */
@Data
public class SysFileInfoVo {
    /** 文件主键 */
    private Long fileId;

    /** 原始文件名 */
    private String originalFilename;

    /** 存储路径（/profile/upload/...） */
    private String fileName;

    /** 磁盘文件名 */
    private String newFileName;

    /** 访问 URL */
    private String url;

    /** 文件大小（字节） */
    private Long fileSize;

    /** 扩展名/类型 */
    private String fileType;

    /** MIME */
    private String contentType;

    /** 删除标志（0正常 1删除） */
    private String isDel;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /** 更新者 */
    private String updateBy;

    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /** 备注 */
    private String remark;
}
