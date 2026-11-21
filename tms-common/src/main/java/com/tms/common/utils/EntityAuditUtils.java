package com.tms.common.utils;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import com.tms.common.core.domain.BaseEntity;

/**
 * 实体审计字段填充（创建人/更新人/创建时间/更新时间）
 * <p>由 {@code AuditFieldInterceptor} 在 MyBatis insert/update 前统一调用，业务代码无需再手写。</p>
 * <p>支持：BaseEntity 及其子类、以及带同名字段的普通 Bean；参数为 Map/Collection 时递归处理。</p>
 *
 * @author tms
 */
public final class EntityAuditUtils
{
    private static final String DEFAULT_OPERATOR = "admin";

    private EntityAuditUtils()
    {
    }

    /**
     * 新增时填充审计字段
     */
    public static void fillInsert(Object parameter)
    {
        process(parameter, true);
    }

    /**
     * 更新时填充审计字段
     */
    public static void fillUpdate(Object parameter)
    {
        process(parameter, false);
    }

    private static void process(Object parameter, boolean insert)
    {
        if (parameter == null)
        {
            return;
        }
        if (parameter instanceof BaseEntity entity)
        {
            apply(entity, insert);
            return;
        }
        if (parameter instanceof Map<?, ?> map)
        {
            for (Object value : map.values())
            {
                process(value, insert);
            }
            return;
        }
        if (parameter instanceof Collection<?> collection)
        {
            for (Object item : collection)
            {
                process(item, insert);
            }
            return;
        }
        // 兜底：非 BaseEntity 但含审计字段的 Bean（如个别 XML 直接传普通对象）
        applyReflectively(parameter, insert);
    }

    private static void apply(BaseEntity entity, boolean insert)
    {
        String operator = resolveOperator();
        Date now = DateUtils.getNowDate();
        if (insert)
        {
            if (StringUtils.isEmpty(entity.getCreateBy()))
            {
                entity.setCreateBy(operator);
            }
            if (entity.getCreateTime() == null)
            {
                entity.setCreateTime(now);
            }
            // 新增时若业务已写入 updateBy（如 Excel 导入），则不覆盖
            if (StringUtils.isEmpty(entity.getUpdateBy()))
            {
                entity.setUpdateBy(operator);
            }
            if (entity.getUpdateTime() == null)
            {
                entity.setUpdateTime(now);
            }
            return;
        }
        entity.setUpdateBy(operator);
        entity.setUpdateTime(now);
    }

    private static void applyReflectively(Object bean, boolean insert)
    {
        if (bean.getClass().getName().startsWith("java."))
        {
            return;
        }
        String operator = resolveOperator();
        Date now = DateUtils.getNowDate();
        if (insert)
        {
            setIfEmpty(bean, "createBy", operator);
            setIfNull(bean, "createTime", now);
            setIfEmpty(bean, "updateBy", operator);
            setIfNull(bean, "updateTime", now);
            return;
        }
        setField(bean, "updateBy", operator);
        setField(bean, "updateTime", now);
    }

    private static void setIfEmpty(Object bean, String fieldName, String value)
    {
        Object current = getField(bean, fieldName);
        if (current == null || (current instanceof String s && StringUtils.isEmpty(s)))
        {
            setField(bean, fieldName, value);
        }
    }

    private static void setIfNull(Object bean, String fieldName, Object value)
    {
        if (getField(bean, fieldName) == null)
        {
            setField(bean, fieldName, value);
        }
    }

    private static Object getField(Object bean, String fieldName)
    {
        try
        {
            Field field = findField(bean.getClass(), fieldName);
            if (field == null)
            {
                return null;
            }
            field.setAccessible(true);
            return field.get(bean);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    private static void setField(Object bean, String fieldName, Object value)
    {
        try
        {
            Field field = findField(bean.getClass(), fieldName);
            if (field == null)
            {
                return;
            }
            field.setAccessible(true);
            field.set(bean, value);
        }
        catch (Exception ignored)
        {
            // 无对应字段则跳过
        }
    }

    private static Field findField(Class<?> type, String name)
    {
        Class<?> current = type;
        while (current != null && current != Object.class)
        {
            try
            {
                return current.getDeclaredField(name);
            }
            catch (NoSuchFieldException e)
            {
                current = current.getSuperclass();
            }
        }
        return null;
    }

    /**
     * 操作人取 sys_user.nick_name（显示名），取不到时回退登录账号，再回退 admin
     */
    private static String resolveOperator()
    {
        try
        {
            String nickName = SecurityUtils.getNickName();
            if (StringUtils.isNotEmpty(nickName))
            {
                return nickName;
            }
            String username = SecurityUtils.getUsername();
            return StringUtils.isNotEmpty(username) ? username : DEFAULT_OPERATOR;
        }
        catch (Exception e)
        {
            return DEFAULT_OPERATOR;
        }
    }
}
