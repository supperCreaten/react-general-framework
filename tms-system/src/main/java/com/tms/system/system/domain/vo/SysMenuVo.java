package com.tms.system.system.domain.vo;

import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 菜单数据对象。
 */
@Data
public class SysMenuVo {
    /** 菜单ID */
    private Long menuId;

    /** 菜单名称 */
    @NotBlank(message = "菜单名称不能为空")
    @Size(max = 50, message = "菜单名称长度不能超过50个字符")
    private String menuName;

    /** 父菜单名称 */
    private String parentName;

    /** 父菜单ID */
    private Long parentId;

    /** 显示排序 */
    @NotNull(message = "显示顺序不能为空")
    private Integer orderNum;

    /** 路由地址，对应 menu_path */
    @Size(max = 200, message = "路由地址不能超过200个字符")
    private String path;

    /** 组件路径 */
    @Size(max = 200, message = "组件路径不能超过255个字符")
    private String component;

    /** 路由参数 */
    private String query;

    /** 路由名称 */
    private String routeName;

    /** 是否外链（0是 1否） */
    private String isFrame = "1";

    /** 是否缓存（0缓存 1不缓存），由 keep_alive 换算 */
    private String isCache = "0";

    /** 菜单类型（0目录 1菜单 2按钮 3页面） */
    @NotBlank(message = "菜单类型不能为空")
    private String menuType;

    /** 显示状态（0显示 1隐藏），对应 hidden */
    private String visible;

    /** 菜单状态（0正常 1停用） */
    private String status;

    /** 删除标志（0存在 1删除） */
    private String isDel;

    /** 权限标识 */
    @Size(max = 100, message = "权限标识长度不能超过100个字符")
    private String perms;

    /** 菜单图标 */
    private String icon;

    /** 子菜单 */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<SysMenuVo> children;

    /** 是否存在子菜单（懒加载标记） */
    private Boolean hasChildren;

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

    /** 备注 */
    private String remark;
}
