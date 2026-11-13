package com.tms.common.utils.log;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 操作日志字段变更项
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperChangeItem
{
    private String field;
    private String label;
    private Object before;
    private Object after;
}
