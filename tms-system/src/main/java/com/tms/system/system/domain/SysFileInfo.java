package com.tms.system.system.domain;

import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 上传文件元数据表 sys_file
 *
 * @author tms
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysFileInfo extends BaseEntity {
    private static final long serialVersionUID = 1L;

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
}
