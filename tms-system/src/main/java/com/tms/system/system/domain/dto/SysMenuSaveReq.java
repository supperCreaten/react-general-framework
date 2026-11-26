package com.tms.system.system.domain.dto;

import com.tms.common.core.domain.BaseEntity;
import com.tms.common.utils.StringUtils;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 菜单新增/修改参数。必填与前端菜单表单一致：上级菜单、菜单名称；目录必填图标，非页面必填排序，非按钮必填路由，按钮必填权限标识。
 */
@Data
@EqualsAndHashCode(callSuper = true)
@SysMenuSaveReq.MenuRules
public class SysMenuSaveReq extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 目录 */
    public static final String TYPE_DIRECTORY = "0";

    /** 菜单 */
    public static final String TYPE_MENU = "1";

    /** 按钮 */
    public static final String TYPE_BUTTON = "2";

    /** 页面 */
    public static final String TYPE_PAGE = "3";

    /** 修改校验组 */
    public interface Update {
    }

    /** 菜单ID（修改时必填） */
    @NotNull(message = "菜单ID不能为空", groups = Update.class)
    private Long menuId;

    /** 上级菜单 */
    @NotNull(message = "上级菜单不能为空")
    private Long parentId;

    /** 菜单类型（0目录 1菜单 2按钮 3页面） */
    @NotBlank(message = "菜单类型不能为空")
    private String menuType;

    /** 菜单图标（目录必填） */
    private String icon;

    /** 菜单名称 */
    @NotBlank(message = "菜单名称不能为空")
    @Size(max = 50, message = "菜单名称长度不能超过50个字符")
    private String menuName;

    /** 显示排序（页面类型可不填） */
    private Integer orderNum;

    /** 是否外链（0是 1否） */
    private String isFrame;

    /** 路由地址（非按钮必填） */
    @Size(max = 200, message = "路由地址不能超过200个字符")
    private String path;

    /** 权限标识（按钮必填） */
    @Size(max = 100, message = "权限标识长度不能超过100个字符")
    private String perms;

    /** 是否缓存（0缓存 1不缓存） */
    private String isCache;

    /** 显示状态（0显示 1隐藏） */
    private String visible;

    /** 菜单状态（0正常 1停用） */
    private String status;

    /**
     * 按菜单类型校验前端条件必填项
     */
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = MenuRulesValidator.class)
    public @interface MenuRules {
        String message() default "菜单参数不完整";

        Class<?>[] groups() default {};

        Class<? extends Payload>[] payload() default {};
    }

    public static class MenuRulesValidator implements ConstraintValidator<MenuRules, SysMenuSaveReq> {
        @Override
        public boolean isValid(SysMenuSaveReq value, ConstraintValidatorContext context) {
            if (value == null) {
                return true;
            }
            String type = value.getMenuType() == null ? "" : value.getMenuType().trim();
            context.disableDefaultConstraintViolation();
            boolean valid = true;
            if (TYPE_DIRECTORY.equals(type) && StringUtils.isEmpty(value.getIcon())) {
                valid = reject(context, "icon", "菜单图标不能为空");
            }
            if (!TYPE_PAGE.equals(type) && value.getOrderNum() == null) {
                valid = reject(context, "orderNum", "显示排序不能为空") && valid;
            }
            if (!TYPE_BUTTON.equals(type) && StringUtils.isEmpty(value.getPath())) {
                valid = reject(context, "path", "路由地址不能为空") && valid;
            }
            if (TYPE_BUTTON.equals(type) && StringUtils.isEmpty(value.getPerms())) {
                valid = reject(context, "perms", "权限标识不能为空") && valid;
            }
            return valid;
        }

        private boolean reject(ConstraintValidatorContext context, String field, String message) {
            context.buildConstraintViolationWithTemplate(message)
                    .addPropertyNode(field)
                    .addConstraintViolation();
            return false;
        }
    }
}
