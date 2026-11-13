package com.tms.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 字典列表查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysDictQuery extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 字典名称
     */
    private String dictName;
    /**
     * 字典编码
     */
    private String dictCode;
    /**
     * 字典状态
     */
    private String status;
}
