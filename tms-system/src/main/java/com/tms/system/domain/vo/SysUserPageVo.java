package com.tms.system.domain.vo;

import com.tms.common.core.domain.entity.SysUser;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.bean.BeanUtils;
import com.tms.common.utils.encrypt.SensitiveDataCrypto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户分页列表出参：手机号/身份证脱敏，密文与密钥取自数据库字段
 *
 * @author tms
 */
@Data
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({
    "admin",
    "delFlag",
    "isDel",
    "loginDate",
    "loginIp",
    "pwdUpdateDate",
    "account",
    "avatar",
    "fullAvatar",
    "password"
})
public class SysUserPageVo extends SysUser
{
    private static final long serialVersionUID = 1L;

    public static SysUserPageVo from(SysUser user)
    {
        SysUserPageVo vo = new SysUserPageVo();
        if (user == null)
        {
            return vo;
        }
        BeanUtils.copyBeanProp(vo, user);

        if (StringUtils.isNotEmpty(user.getPhonenumber()))
        {
            vo.setPhonenumber(SensitiveDataCrypto.desensitizePhone(user.getPhonenumber()));
        }
        if (StringUtils.isNotEmpty(user.getIdCard()))
        {
            vo.setIdCard(SensitiveDataCrypto.desensitizeIdCard(user.getIdCard()));
        }
        return vo;
    }
}
