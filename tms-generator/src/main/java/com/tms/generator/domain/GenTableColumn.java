package com.tms.generator.domain;

import jakarta.validation.constraints.NotBlank;
import com.tms.common.core.domain.BaseEntity;
import com.tms.common.utils.StringUtils;

/**
 * 代码生成业务字段表 gen_table_column
 * 
 * @author tms
 */
public class GenTableColumn extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 编号 */
    private Long columnId;

    /** 归属表编号 */
    private Long tableId;

    /** 列名称 */
    private String columnName;

    /** 列描述 */
    private String columnComment;

    /** 列类型 */
    private String columnType;

    /** JAVA类型 */
    private String javaType;

    /** JAVA字段名 */
    @NotBlank(message = "Java属性不能为空")
    private String javaField;

    /** 是否主键（1是） */
    private String isPk;

    /** 是否自增（1是） */
    private String isIncrement;

    /** 是否必填（1是） */
    private String isRequired;

    /** 是否为插入字段（1是） */
    private String isInsert;

    /** 是否编辑字段（1是） */
    private String isEdit;

    /** 是否列表字段（1是） */
    private String isList;

    /** 是否查询字段（1是） */
    private String isQuery;

    /** 查询方式（EQ等于、NE不等于、GT大于、LT小于、LIKE模糊、BETWEEN范围） */
    private String queryType;

    /** 显示类型（input文本框、textarea文本域、select下拉框、checkbox复选框、radio单选框、datetime日期控件、image图片上传控件、upload文件上传控件、editor富文本控件） */
    private String htmlType;

    /** 字典类型 */
    private String dictType;

    /** 排序 */
    private Integer sort;

    /**
     * 设置列编号
     * @param columnId 属性值
     */
    public void setColumnId(Long columnId)
    {
        this.columnId = columnId;
    }

    /**
     * 获取列编号
     */
    public Long getColumnId()
    {
        return columnId;
    }

    /**
     * 设置归属表编号
     * @param tableId 属性值
     */
    public void setTableId(Long tableId)
    {
        this.tableId = tableId;
    }

    /**
     * 获取归属表编号
     */
    public Long getTableId()
    {
        return tableId;
    }

    /**
     * 设置列名
     * @param columnName 属性值
     */
    public void setColumnName(String columnName)
    {
        this.columnName = columnName;
    }

    /**
     * 获取列名
     */
    public String getColumnName()
    {
        return columnName;
    }

    /**
     * 设置列描述
     * @param columnComment 属性值
     */
    public void setColumnComment(String columnComment)
    {
        this.columnComment = columnComment;
    }

    /**
     * 获取列描述
     */
    public String getColumnComment()
    {
        return columnComment;
    }

    /**
     * 设置列类型
     * @param columnType 属性值
     */
    public void setColumnType(String columnType)
    {
        this.columnType = columnType;
    }

    /**
     * 获取列类型
     */
    public String getColumnType()
    {
        return columnType;
    }

    /**
     * 设置 Java 类型
     * @param javaType 属性值
     */
    public void setJavaType(String javaType)
    {
        this.javaType = javaType;
    }

    /**
     * 获取 Java 类型
     */
    public String getJavaType()
    {
        return javaType;
    }

    /**
     * 设置 Java 字段名
     * @param javaField 属性值
     */
    public void setJavaField(String javaField)
    {
        this.javaField = javaField;
    }

    /**
     * 获取 Java 字段名
     */
    public String getJavaField()
    {
        return javaField;
    }

    /**
     * 获取首字母大写的 Java 字段名
     */
    public String getCapJavaField()
    {
        return StringUtils.capitalize(javaField);
    }

    /**
     * 设置是否主键
     * @param isPk 属性值
     */
    public void setIsPk(String isPk)
    {
        this.isPk = isPk;
    }

    /**
     * 获取是否主键
     */
    public String getIsPk()
    {
        return isPk;
    }

    /**
     * 是否主键列
     */
    public boolean isPk()
    {
        return isPk(this.isPk);
    }

    /**
     * 是否主键列
     * @param isPk 参数
     */
    public boolean isPk(String isPk)
    {
        return isPk != null && StringUtils.equals("1", isPk);
    }

    /**
     * 获取是否自增
     */
    public String getIsIncrement()
    {
        return isIncrement;
    }

    /**
     * 设置是否自增
     * @param isIncrement 属性值
     */
    public void setIsIncrement(String isIncrement)
    {
        this.isIncrement = isIncrement;
    }

    /**
     * 是否自增列
     */
    public boolean isIncrement()
    {
        return isIncrement(this.isIncrement);
    }

    /**
     * 是否自增列
     * @param isIncrement 参数
     */
    public boolean isIncrement(String isIncrement)
    {
        return isIncrement != null && StringUtils.equals("1", isIncrement);
    }

    /**
     * 设置是否必填
     * @param isRequired 属性值
     */
    public void setIsRequired(String isRequired)
    {
        this.isRequired = isRequired;
    }

    /**
     * 获取是否必填
     */
    public String getIsRequired()
    {
        return isRequired;
    }

    /**
     * 是否必填列
     */
    public boolean isRequired()
    {
        return isRequired(this.isRequired);
    }

    /**
     * 是否必填列
     * @param isRequired 参数
     */
    public boolean isRequired(String isRequired)
    {
        return isRequired != null && StringUtils.equals("1", isRequired);
    }

    /**
     * 设置是否插入字段
     * @param isInsert 属性值
     */
    public void setIsInsert(String isInsert)
    {
        this.isInsert = isInsert;
    }

    /**
     * 获取是否插入字段
     */
    public String getIsInsert()
    {
        return isInsert;
    }

    /**
     * 是否插入字段
     */
    public boolean isInsert()
    {
        return isInsert(this.isInsert);
    }

    /**
     * 是否插入字段
     * @param isInsert 参数
     */
    public boolean isInsert(String isInsert)
    {
        return isInsert != null && StringUtils.equals("1", isInsert);
    }

    /**
     * 设置是否编辑字段
     * @param isEdit 属性值
     */
    public void setIsEdit(String isEdit)
    {
        this.isEdit = isEdit;
    }

    /**
     * 获取是否编辑字段
     */
    public String getIsEdit()
    {
        return isEdit;
    }

    /**
     * 是否编辑字段
     */
    public boolean isEdit()
    {
        return isInsert(this.isEdit);
    }

    /**
     * 是否编辑字段
     * @param isEdit 参数
     */
    public boolean isEdit(String isEdit)
    {
        return isEdit != null && StringUtils.equals("1", isEdit);
    }

    /**
     * 设置是否列表字段
     * @param isList 属性值
     */
    public void setIsList(String isList)
    {
        this.isList = isList;
    }

    /**
     * 获取是否列表字段
     */
    public String getIsList()
    {
        return isList;
    }

    /**
     * 是否列表字段
     */
    public boolean isList()
    {
        return isList(this.isList);
    }

    /**
     * 是否列表字段
     * @param isList 参数
     */
    public boolean isList(String isList)
    {
        return isList != null && StringUtils.equals("1", isList);
    }

    /**
     * 设置是否查询字段
     * @param isQuery 属性值
     */
    public void setIsQuery(String isQuery)
    {
        this.isQuery = isQuery;
    }

    /**
     * 获取是否查询字段
     */
    public String getIsQuery()
    {
        return isQuery;
    }

    /**
     * 是否查询字段
     */
    public boolean isQuery()
    {
        return isQuery(this.isQuery);
    }

    /**
     * 是否查询字段
     * @param isQuery 参数
     */
    public boolean isQuery(String isQuery)
    {
        return isQuery != null && StringUtils.equals("1", isQuery);
    }

    /**
     * 设置查询方式
     * @param queryType 属性值
     */
    public void setQueryType(String queryType)
    {
        this.queryType = queryType;
    }

    /**
     * 获取查询方式
     */
    public String getQueryType()
    {
        return queryType;
    }

    /**
     * 获取页面控件类型
     */
    public String getHtmlType()
    {
        return htmlType;
    }

    /**
     * 设置页面控件类型
     * @param htmlType 属性值
     */
    public void setHtmlType(String htmlType)
    {
        this.htmlType = htmlType;
    }

    /**
     * 设置字典类型
     * @param dictType 属性值
     */
    public void setDictType(String dictType)
    {
        this.dictType = dictType;
    }

    /**
     * 获取字典类型
     */
    public String getDictType()
    {
        return dictType;
    }

    /**
     * 设置显示排序
     * @param sort 属性值
     */
    public void setSort(Integer sort)
    {
        this.sort = sort;
    }

    /**
     * 获取显示排序
     */
    public Integer getSort()
    {
        return sort;
    }

    /**
     * 是否为 BaseEntity/TreeEntity 通用列
     */
    public boolean isSuperColumn()
    {
        return isSuperColumn(this.javaField);
    }

    /**
     * 是否为 BaseEntity/TreeEntity 通用列
     * @param javaField Java 字段名
     */
    public static boolean isSuperColumn(String javaField)
    {
        return StringUtils.equalsAnyIgnoreCase(javaField,
                // BaseEntity
                "createBy", "createTime", "updateBy", "updateTime", "remark",
                // TreeEntity
                "parentName", "parentId", "orderNum", "ancestors");
    }

    /**
     * 是否为生成页面需保留的白名单列
     */
    public boolean isUsableColumn()
    {
        return isUsableColumn(javaField);
    }

    /**
     * 是否为生成页面需保留的白名单列
     * @param javaField Java 字段名
     */
    public static boolean isUsableColumn(String javaField)
    {
        // isSuperColumn()中的名单用于避免生成多余Domain属性，若某些属性在生成页面时需要用到不能忽略，则放在此处白名单
        return StringUtils.equalsAnyIgnoreCase(javaField, "parentId", "orderNum", "remark");
    }

    /**
     * 从列注释解析 Excel 导出转换表达式
     */
    public String readConverterExp()
    {
        String remarks = StringUtils.substringBetween(this.columnComment, "（", "）");
        StringBuffer sb = new StringBuffer();
        if (StringUtils.isNotEmpty(remarks))
        {
            for (String value : remarks.split(" "))
            {
                if (StringUtils.isNotEmpty(value))
                {
                    Object startStr = value.subSequence(0, 1);
                    String endStr = value.substring(1);
                    sb.append("").append(startStr).append("=").append(endStr).append(",");
                }
            }
            return sb.deleteCharAt(sb.length() - 1).toString();
        }
        else
        {
            return this.columnComment;
        }
    }
}
