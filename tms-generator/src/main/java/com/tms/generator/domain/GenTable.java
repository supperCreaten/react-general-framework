package com.tms.generator.domain;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.apache.commons.lang3.ArrayUtils;
import com.tms.common.constant.GenConstants;
import com.tms.common.core.domain.BaseEntity;
import com.tms.common.utils.StringUtils;

/**
 * 业务表 gen_table
 * 
 * @author tms
 */
public class GenTable extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 编号 */
    private Long tableId;

    /** 表名称 */
    @NotBlank(message = "表名称不能为空")
    private String tableName;

    /** 表描述 */
    @NotBlank(message = "表描述不能为空")
    private String tableComment;

    /** 关联父表的表名 */
    private String subTableName;

    /** 本表关联父表的外键名 */
    private String subTableFkName;

    /** 实体类名称(首字母大写) */
    @NotBlank(message = "实体类名称不能为空")
    private String className;

    /** 使用的模板（crud单表操作 tree树表操作 sub主子表操作） */
    private String tplCategory;

    /** 前端类型（element-ui模版 element-plus模版 element-plus-typescript模版） */
    private String tplWebType;

    /** 生成包路径 */
    @NotBlank(message = "生成包路径不能为空")
    private String packageName;

    /** 生成模块名 */
    @NotBlank(message = "生成模块名不能为空")
    private String moduleName;

    /** 生成业务名 */
    @NotBlank(message = "生成业务名不能为空")
    private String businessName;

    /** 生成功能名 */
    @NotBlank(message = "生成功能名不能为空")
    private String functionName;

    /** 生成作者 */
    @NotBlank(message = "作者不能为空")
    private String functionAuthor;

    /** 表单布局（单列 双列 三列） */
    private Integer formColNum;

    /** 生成代码方式（0zip压缩包 1自定义路径） */
    private String genType;

    /** 生成路径（不填默认项目路径） */
    private String genPath;

    /** 主键信息 */
    private GenTableColumn pkColumn;

    /** 子表信息 */
    private GenTable subTable;

    /** 表列信息 */
    @Valid
    private List<GenTableColumn> columns;

    /** 其它生成选项 */
    private String options;

    /** 树编码字段 */
    private String treeCode;

    /** 树父编码字段 */
    private String treeParentCode;

    /** 树名称字段 */
    private String treeName;

    /** 上级菜单ID字段 */
    private Long parentMenuId;

    /** 上级菜单名称字段 */
    private String parentMenuName;

    /**
     * 获取表编号
     */
    public Long getTableId()
    {
        return tableId;
    }

    /**
     * 设置表编号
     * @param tableId 属性值
     */
    public void setTableId(Long tableId)
    {
        this.tableId = tableId;
    }

    /**
     * 获取表名称
     */
    public String getTableName()
    {
        return tableName;
    }

    /**
     * 设置表名称
     * @param tableName 属性值
     */
    public void setTableName(String tableName)
    {
        this.tableName = tableName;
    }

    /**
     * 获取表描述
     */
    public String getTableComment()
    {
        return tableComment;
    }

    /**
     * 设置表描述
     * @param tableComment 属性值
     */
    public void setTableComment(String tableComment)
    {
        this.tableComment = tableComment;
    }

    /**
     * 获取关联子表表名
     */
    public String getSubTableName()
    {
        return subTableName;
    }

    /**
     * 设置关联子表表名
     * @param subTableName 属性值
     */
    public void setSubTableName(String subTableName)
    {
        this.subTableName = subTableName;
    }

    /**
     * 获取子表外键字段名
     */
    public String getSubTableFkName()
    {
        return subTableFkName;
    }

    /**
     * 设置子表外键字段名
     * @param subTableFkName 属性值
     */
    public void setSubTableFkName(String subTableFkName)
    {
        this.subTableFkName = subTableFkName;
    }

    /**
     * 获取实体类名
     */
    public String getClassName()
    {
        return className;
    }

    /**
     * 设置实体类名
     * @param className 属性值
     */
    public void setClassName(String className)
    {
        this.className = className;
    }

    /**
     * 获取代码模板类型
     */
    public String getTplCategory()
    {
        return tplCategory;
    }

    /**
     * 设置代码模板类型
     * @param tplCategory 属性值
     */
    public void setTplCategory(String tplCategory)
    {
        this.tplCategory = tplCategory;
    }

    /**
     * 获取前端模板类型
     */
    public String getTplWebType()
    {
        return tplWebType;
    }

    /**
     * 设置前端模板类型
     * @param tplWebType 属性值
     */
    public void setTplWebType(String tplWebType)
    {
        this.tplWebType = tplWebType;
    }

    /**
     * 获取生成包路径
     */
    public String getPackageName()
    {
        return packageName;
    }

    /**
     * 设置生成包路径
     * @param packageName 属性值
     */
    public void setPackageName(String packageName)
    {
        this.packageName = packageName;
    }

    /**
     * 获取生成模块名
     */
    public String getModuleName()
    {
        return moduleName;
    }

    /**
     * 设置生成模块名
     * @param moduleName 属性值
     */
    public void setModuleName(String moduleName)
    {
        this.moduleName = moduleName;
    }

    /**
     * 获取生成业务名
     */
    public String getBusinessName()
    {
        return businessName;
    }

    /**
     * 设置生成业务名
     * @param businessName 属性值
     */
    public void setBusinessName(String businessName)
    {
        this.businessName = businessName;
    }

    /**
     * 获取生成功能名
     */
    public String getFunctionName()
    {
        return functionName;
    }

    /**
     * 设置生成功能名
     * @param functionName 属性值
     */
    public void setFunctionName(String functionName)
    {
        this.functionName = functionName;
    }

    /**
     * 获取生成作者
     */
    public String getFunctionAuthor()
    {
        return functionAuthor;
    }

    /**
     * 设置生成作者
     * @param functionAuthor 属性值
     */
    public void setFunctionAuthor(String functionAuthor)
    {
        this.functionAuthor = functionAuthor;
    }

    /**
     * 获取表单列布局
     */
    public Integer getFormColNum()
    {
        return formColNum;
    }

    /**
     * 设置表单列布局
     * @param formColNum 属性值
     */
    public void setFormColNum(Integer formColNum)
    {
        this.formColNum = formColNum;
    }

    /**
     * 获取代码生成方式
     */
    public String getGenType()
    {
        return genType;
    }

    /**
     * 设置代码生成方式
     * @param genType 属性值
     */
    public void setGenType(String genType)
    {
        this.genType = genType;
    }

    /**
     * 获取自定义生成路径
     */
    public String getGenPath()
    {
        return genPath;
    }

    /**
     * 设置自定义生成路径
     * @param genPath 属性值
     */
    public void setGenPath(String genPath)
    {
        this.genPath = genPath;
    }

    /**
     * 获取主键列信息
     */
    public GenTableColumn getPkColumn()
    {
        return pkColumn;
    }

    /**
     * 设置主键列信息
     * @param pkColumn 属性值
     */
    public void setPkColumn(GenTableColumn pkColumn)
    {
        this.pkColumn = pkColumn;
    }

    /**
     * 获取子表信息
     */
    public GenTable getSubTable()
    {
        return subTable;
    }

    /**
     * 设置子表信息
     * @param subTable 属性值
     */
    public void setSubTable(GenTable subTable)
    {
        this.subTable = subTable;
    }

    /**
     * 获取表列集合
     */
    public List<GenTableColumn> getColumns()
    {
        return columns;
    }

    /**
     * 设置表列集合
     * @param columns 属性值
     */
    public void setColumns(List<GenTableColumn> columns)
    {
        this.columns = columns;
    }

    /**
     * 获取其它生成选项 JSON
     */
    public String getOptions()
    {
        return options;
    }

    /**
     * 设置其它生成选项 JSON
     * @param options 属性值
     */
    public void setOptions(String options)
    {
        this.options = options;
    }

    /**
     * 获取树编码字段
     */
    public String getTreeCode()
    {
        return treeCode;
    }

    /**
     * 设置树编码字段
     * @param treeCode 属性值
     */
    public void setTreeCode(String treeCode)
    {
        this.treeCode = treeCode;
    }

    /**
     * 获取树父编码字段
     */
    public String getTreeParentCode()
    {
        return treeParentCode;
    }

    /**
     * 设置树父编码字段
     * @param treeParentCode 属性值
     */
    public void setTreeParentCode(String treeParentCode)
    {
        this.treeParentCode = treeParentCode;
    }

    /**
     * 获取树名称字段
     */
    public String getTreeName()
    {
        return treeName;
    }

    /**
     * 设置树名称字段
     * @param treeName 属性值
     */
    public void setTreeName(String treeName)
    {
        this.treeName = treeName;
    }

    /**
     * 获取上级菜单 ID
     */
    public Long getParentMenuId()
    {
        return parentMenuId;
    }

    /**
     * 设置上级菜单 ID
     * @param parentMenuId 属性值
     */
    public void setParentMenuId(Long parentMenuId)
    {
        this.parentMenuId = parentMenuId;
    }

    /**
     * 获取上级菜单名称
     */
    public String getParentMenuName()
    {
        return parentMenuName;
    }

    /**
     * 设置上级菜单名称
     * @param parentMenuName 属性值
     */
    public void setParentMenuName(String parentMenuName)
    {
        this.parentMenuName = parentMenuName;
    }

    /**
     * 是否为主子表模板
     */
    public boolean isSub()
    {
        return isSub(this.tplCategory);
    }

    /**
     * 是否为主子表模板
     * @param tplCategory 模板类型
     */
    public static boolean isSub(String tplCategory)
    {
        return tplCategory != null && StringUtils.equals(GenConstants.TPL_SUB, tplCategory);
    }

    /**
     * 是否为树表模板
     */
    public boolean isTree()
    {
        return isTree(this.tplCategory);
    }

    /**
     * 是否为树表模板
     * @param tplCategory 模板类型
     */
    public static boolean isTree(String tplCategory)
    {
        return tplCategory != null && StringUtils.equals(GenConstants.TPL_TREE, tplCategory);
    }

    /**
     * 是否为单表 CRUD 模板
     */
    public boolean isCrud()
    {
        return isCrud(this.tplCategory);
    }

    /**
     * 是否为单表 CRUD 模板
     * @param tplCategory 模板类型
     */
    public static boolean isCrud(String tplCategory)
    {
        return tplCategory != null && StringUtils.equals(GenConstants.TPL_CRUD, tplCategory);
    }

    /**
     * 是否为需忽略的通用列字段
     * @param javaField Java 字段名
     */
    public boolean isSuperColumn(String javaField)
    {
        return isSuperColumn(this.tplCategory, javaField);
    }

    /**
     * 是否为需忽略的通用列字段
     * @param tplCategory 模板类型
     * @param javaField Java 字段名
     */
    public static boolean isSuperColumn(String tplCategory, String javaField)
    {
        if (isTree(tplCategory))
        {
            return StringUtils.equalsAnyIgnoreCase(javaField,
                    ArrayUtils.addAll(GenConstants.TREE_ENTITY, GenConstants.BASE_ENTITY));
        }
        return StringUtils.equalsAnyIgnoreCase(javaField, GenConstants.BASE_ENTITY);
    }
}