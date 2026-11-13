package com.tms.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * 字典新增/修改参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysDictSaveReq extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 字典ID（修改时必填）
     */
    private Long dictId;
    /**
     * 字典名称
     */
    @NotBlank(message = "字典名称不能为空")
    private String dictName;
    /**
     * 字典编码
     */
    @NotBlank(message = "字典编码不能为空")
    private String dictCode;
    /**
     * 字典状态
     */
    @NotBlank(message = "字典状态不能为空")
    private String status;
    /**
     * 字典项列表
     */
    @Valid
    private List<SysDictDataSaveReq> items;
}
