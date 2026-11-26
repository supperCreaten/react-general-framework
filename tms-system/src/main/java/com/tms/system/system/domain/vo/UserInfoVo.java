package com.tms.system.system.domain.vo;

import java.util.Set;
import com.tms.system.system.domain.vo.SysUserVo;
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
    private SysUserVo user;
}
