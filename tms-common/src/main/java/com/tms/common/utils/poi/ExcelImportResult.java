package com.tms.common.utils.poi;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;

/**
 * Excel 导入结果（含校验错误与错误文件）
 */
@Data
public class ExcelImportResult<T> {
    /** 解析出的全部数据行（与 sheetRowIndexes 一一对应） */
    private List<T> rows = new ArrayList<>();

    /** 数据行对应的 sheet 行下标（0-based） */
    private List<Integer> sheetRowIndexes = new ArrayList<>();

    /** sheet 行下标 -> 错误信息 */
    private Map<Integer, String> errors = new LinkedHashMap<>();

    /** 含错误信息列的 Excel 文件内容 */
    private byte[] errorFileBytes;

    /** 错误文件下载名 */
    private String errorFileName = "导入错误明细.xlsx";

    /**
     * 是否存在errors
     */
    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }

    /**
     * 获取Excel 导入结果（含校验错误与错误文件）
     */
    public int getErrorCount() {
        return errors == null ? 0 : errors.size();
    }

    /**
     * 校验通过的数据行
     */
    public List<T> getValidRows() {
        if (rows == null || rows.isEmpty()) {
            return Collections.emptyList();
        }
        if (!hasErrors()) {
            return rows;
        }
        List<T> valid = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            Integer sheetRow = sheetRowIndexes.get(i);
            if (!errors.containsKey(sheetRow)) {
                valid.add(rows.get(i));
            }
        }
        return valid;
    }

    /**
     * 校验通过的数据行对应的 sheet 行下标
     */
    public List<Integer> getValidSheetRowIndexes() {
        if (sheetRowIndexes == null || sheetRowIndexes.isEmpty()) {
            return Collections.emptyList();
        }
        if (!hasErrors()) {
            return sheetRowIndexes;
        }
        List<Integer> valid = new ArrayList<>();
        for (int i = 0; i < sheetRowIndexes.size(); i++) {
            Integer sheetRow = sheetRowIndexes.get(i);
            if (!errors.containsKey(sheetRow)) {
                valid.add(sheetRow);
            }
        }
        return valid;
    }

    /**
     * 校验通过的行数
     */
    public int getValidCount() {
        return getValidRows().size();
    }
}
