package com.tms.system.domain.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * 部门树节点 / 详情返回
 */
@Data
public class SysDeptVo {
    /** 部门ID */
    private Long deptId;

    /** 父部门ID */
    private Long parentId;

    /** 祖级列表 */
    private String ancestors;

    /** 部门名称 */
    private String deptName;

    /** 显示排序 */
    private Integer orderNum;

    /** 负责人 */
    private String leader;

    /** 联系电话 */
    private String phone;

    /** 邮箱 */
    private String email;

    /** 部门状态（0正常 1停用） */
    private String status;

    /** 删除标志（0存在 1删除） */
    private String isDel;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /** 备注 */
    private String remark;

    /** 是否存在子部门（懒加载标记） */
    private Boolean hasChildren;

    /** 子部门 */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<SysDeptVo> children = new ArrayList<>();
}
