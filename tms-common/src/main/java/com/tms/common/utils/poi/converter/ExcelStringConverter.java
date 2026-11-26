package com.tms.common.utils.poi.converter;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;
import com.tms.common.utils.StringUtils;

import java.math.BigDecimal;

/**
 * EasyExcel 字符串转换：数字单元格去尾随 0，避免 1280.0
 */
public class ExcelStringConverter implements Converter<String> {
    @Override
    /**
     * 支持的 Java 类型
     */
    public Class<?> supportJavaTypeKey() {
        return String.class;
    }

    @Override
    /**
     * 支持的 Excel 单元格类型
     */
    public CellDataTypeEnum supportExcelTypeKey() {
        return null;
    }

    @Override
    /**
     * Excel 单元格转为 Java 数据
     */
    public String convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty contentProperty,
                                    GlobalConfiguration globalConfiguration) {
        if (cellData == null) {
            return null;
        }
        if (cellData.getType() == CellDataTypeEnum.NUMBER && cellData.getNumberValue() != null) {
            return cellData.getNumberValue().stripTrailingZeros().toPlainString();
        }
        if (cellData.getType() == CellDataTypeEnum.BOOLEAN && cellData.getBooleanValue() != null) {
            return String.valueOf(cellData.getBooleanValue());
        }
        String str = cellData.getStringValue();
        if (StringUtils.isNotEmpty(str)) {
            return str.trim();
        }
        BigDecimal number = cellData.getNumberValue();
        if (number != null) {
            return number.stripTrailingZeros().toPlainString();
        }
        return null;
    }

    @Override
    /**
     * Java 数据写入 Excel 单元格
     */
    public WriteCellData<?> convertToExcelData(String value, ExcelContentProperty contentProperty,
                                               GlobalConfiguration globalConfiguration) {
        return new WriteCellData<>(value == null ? "" : value);
    }
}
