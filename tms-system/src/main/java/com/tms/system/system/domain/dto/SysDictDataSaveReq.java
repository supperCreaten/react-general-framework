package com.tms.system.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 字典项保存参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysDictDataSaveReq extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 字典项ID
     */
    private Long id;
    /**
     * 所属字典主表ID
     */
    private Long dictId;
    /**
     * 字典标签
     */
    private String dictLabel;
    /**
     * 字典键值
     */
    private String dictValue;
    /**
     * 字典项状态
     */
    private String status;
}
