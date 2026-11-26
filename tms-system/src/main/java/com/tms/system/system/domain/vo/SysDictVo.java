package com.tms.system.system.domain.vo;

import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * 字典查询结果
 */
@Data
public class SysDictVo {
    /** 字典ID */
    private Long dictId;

    /** 字典名称 */
    private String dictName;

    /** 字典编码 */
    private String dictCode;

    /** 字典状态 */
    private String status;

    /** 字典项 */
    private List<SysDictDataVo> items;

    /** 备注 */
    private String remark;

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
}
