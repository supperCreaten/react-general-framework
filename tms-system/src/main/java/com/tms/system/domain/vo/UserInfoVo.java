package com.tms.system.domain.vo;

import java.util.Set;
import com.tms.common.core.domain.entity.SysUser;
import lombok.Data;

/**
 * 当前登录用户信息（对齐若依 getInfo：permissions / roles / user）
 *
 * @author tms
 */
@Data
public class UserInfoVo
{
    /** 菜单权限标识集合 */
    private Set<String> permissions;

    /** 角色权限字符集合 */
    private Set<String> roles;

    /** 用户详细信息 */
    private SysUser user;
}
