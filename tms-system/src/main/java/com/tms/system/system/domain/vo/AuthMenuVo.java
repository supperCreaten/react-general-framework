package com.tms.system.system.domain.vo;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

/**
 * 授权路由节点（字段集不变；序列化顺序对齐若依：标识字段在前，children 在末）
 *
 * @author tms
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "menuId", "menuName", "path", "hidden", "menuType", "component", "meta", "children" })
public class AuthMenuVo
{
    private Long menuId;

    private String menuName;

    private String path;

    private boolean hidden;

    private Integer menuType;

    private String component;

    private Map<String, Object> meta;

    private List<AuthMenuVo> children;

    /**
     * 构建路由 meta（title/icon/keepAlive）
     */
    public static Map<String, Object> buildMeta(String title, String icon, int keepAlive)
    {
        Map<String, Object> meta = new LinkedHashMap<>(4);
        meta.put("title", title);
        meta.put("icon", icon);
        meta.put("keepAlive", keepAlive);
        return meta;
    }
}
