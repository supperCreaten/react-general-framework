package com.tms.system.system.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Validator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import com.tms.common.config.TmsConfig;
import com.tms.common.constant.UserConstants;
import com.tms.system.system.domain.vo.SysRoleVo;
import com.tms.system.system.domain.vo.SysUserVo;
import com.tms.common.enums.DesensitizedType;
import com.tms.common.exception.ServiceException;
import com.tms.common.utils.SecurityUtils;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.bean.BeanValidators;
import com.tms.common.utils.encrypt.SensitiveCryptoResult;
import com.tms.common.utils.encrypt.SensitiveDataCrypto;
import com.tms.system.system.domain.SysUserRole;
import com.tms.system.system.domain.convert.PageVos;
import com.tms.system.system.domain.dto.SysUserAuthRoleReq;
import com.tms.system.system.domain.dto.SysUserQuery;
import com.tms.system.system.domain.dto.SysUserResetPwdReq;
import com.tms.system.system.domain.dto.SysUserSaveReq;
import com.tms.system.system.domain.dto.SysUserStatusReq;
import com.tms.system.system.domain.vo.SysUserPageVo;
import com.tms.system.system.mapper.SysRoleMapper;
import com.tms.system.system.mapper.SysUserMapper;
import com.tms.system.system.mapper.SysUserRoleMapper;
import com.tms.system.system.service.ISysUserService;

/**
 * 用户 业务层处理
 *
 * @author tms
 */
@Service
public class SysUserServiceImpl implements ISysUserService {
    private static final Logger log = LoggerFactory.getLogger(SysUserServiceImpl.class);

    @Autowired
    private SysUserMapper userMapper;

    @Autowired
    private SysRoleMapper roleMapper;

    @Autowired
    private SysUserRoleMapper userRoleMapper;

    @Autowired
    protected Validator validator;

    /**
     * 根据条件分页查询用户列表
     *
     * @param user 用户信息
     * @return 用户信息集合信息
     */
    @Override
    public List<SysUserPageVo> selectUserList(SysUserQuery query) {
        List<SysUserVo> list = userMapper.selectUserList(query == null ? new SysUserQuery() : query);
        for (SysUserVo item : list) {
            if (ensureSensitiveCrypto(item)) {
                userMapper.updateUserSensitiveCrypto(item);
            }
        }
        return PageVos.map(list, SysUserPageVo::from);
    }

    /**
     * 根据条件分页查询已分配用户角色列表
     *
     * @param user 用户信息
     * @return 用户信息集合信息
     */
    @Override
    public List<SysUserPageVo> selectAllocatedList(SysUserQuery query) {
        List<SysUserVo> list = userMapper.selectAllocatedList(query == null ? new SysUserQuery() : query);
        return PageVos.map(list, SysUserPageVo::from);
    }

    /**
     * 根据条件分页查询未分配用户角色列表
     *
     * @param user 用户信息
     * @return 用户信息集合信息
     */
    @Override
    public List<SysUserPageVo> selectUnallocatedList(SysUserQuery query) {
        List<SysUserVo> list = userMapper.selectUnallocatedList(query == null ? new SysUserQuery() : query);
        return PageVos.map(list, SysUserPageVo::from);
    }

    /**
     * 通过用户名查询用户
     *
     * @param userName 用户名
     * @return 用户对象信息
     */
    @Override
    public SysUserVo selectUserByUserName(String userName) {
        return userMapper.selectUserByUserName(userName);
    }

    /**
     * 通过用户ID查询用户
     *
     * @param userId 用户ID
     * @return 用户对象信息
     */
    @Override
    public SysUserVo selectUserById(Long userId) {
        return userMapper.selectUserById(userId);
    }

    /**
     * 用户详情
     */
    @Override
    public SysUserVo selectUserVoById(Long userId) {
        SysUserVo user = selectUserById(userId);
        if (user != null && user.getRoles() != null && (user.getRoleIds() == null || user.getRoleIds().length == 0)) {
            user.setRoleIds(user.getRoles().stream().map(SysRoleVo::getRoleId).filter(id -> id != null).toArray(Long[]::new));
        }
        return user;
    }

    /**
     * 查询用户所属角色组
     *
     * @param userName 用户名
     * @return 结果
     */
    @Override
    public String selectUserRoleGroup(String userName) {
        List<SysRoleVo> list = roleMapper.selectRolesByUserName(userName);
        if (CollectionUtils.isEmpty(list)) {
            return StringUtils.EMPTY;
        }
        return list.stream().map(SysRoleVo::getRoleName).collect(Collectors.joining(","));
    }

    /**
     * 校验用户名称是否唯一
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    public boolean checkUserNameUnique(SysUserVo user) {
        Long userId = StringUtils.isNull(user.getUserId()) ? -1L : user.getUserId();
        SysUserVo info = userMapper.checkUserNameUnique(user.getUserName());
        if (StringUtils.isNotNull(info) && info.getUserId().longValue() != userId.longValue()) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验用户名称是否唯一
     */
    @Override
    public boolean checkUserNameUnique(SysUserSaveReq user) {
        return checkUserNameUnique(user.toEntity());
    }

    /**
     * 校验手机号码是否唯一
     *
     * @param user 用户信息
     * @return
     */
    @Override
    public boolean checkPhoneUnique(SysUserVo user) {
        Long userId = StringUtils.isNull(user.getUserId()) ? -1L : user.getUserId();
        String phone = user.getPhonenumber();
        SysUserVo info = userMapper.checkPhoneUnique(phone, null);
        if (StringUtils.isNotNull(info) && info.getUserId().longValue() != userId.longValue()) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验手机号码是否唯一
     */
    @Override
    public boolean checkPhoneUnique(SysUserSaveReq user) {
        return checkPhoneUnique(user.toEntity());
    }

    /**
     * 校验email是否唯一
     *
     * @param user 用户信息
     * @return
     */
    @Override
    public boolean checkEmailUnique(SysUserVo user) {
        Long userId = StringUtils.isNull(user.getUserId()) ? -1L : user.getUserId();
        SysUserVo info = userMapper.checkEmailUnique(user.getEmail());
        if (StringUtils.isNotNull(info) && info.getUserId().longValue() != userId.longValue()) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验email是否唯一
     */
    @Override
    public boolean checkEmailUnique(SysUserSaveReq user) {
        return checkEmailUnique(user.toEntity());
    }

    /**
     * 校验用户是否允许操作
     *
     * @param user 用户信息
     */
    @Override
    public void checkUserAllowed(SysUserVo user) {
        if (StringUtils.isNotNull(user.getUserId()) && user.isAdmin()) {
            throw new ServiceException("不允许操作超级管理员用户");
        }
    }

    /**
     * 校验用户是否允许操作
     */
    @Override
    public void checkUserAllowed(Long userId) {
        checkUserAllowed(new SysUserVo(userId));
    }

    /**
     * 新增保存用户信息
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    @Transactional
    public int insertUser(SysUserVo user) {
        resolveUserAccount(user);
        fillSensitiveCrypto(user);
        int rows = userMapper.insertUser(user);
        // 新增用户与角色管理
        insertUserRole(user);
        return rows;
    }

    /**
     * 新增保存用户信息
     */
    @Override
    @Transactional
    public int insertUser(SysUserSaveReq req) {
        SysUserVo user = req.toEntity();
        String rawPassword = StringUtils.isNotEmpty(user.getPassword()) ? user.getPassword() : TmsConfig.getInitPassword();
        user.setPassword(SecurityUtils.encryptPassword(rawPassword));
        if (StringUtils.isEmpty(user.getStatus())) {
            user.setStatus(UserConstants.NORMAL);
        }
        return insertUser(user);
    }

    /**
     * 注册用户信息
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    public boolean registerUser(SysUserVo user) {
        resolveUserAccount(user);
        fillSensitiveCrypto(user);
        return userMapper.insertUser(user) > 0;
    }

    /**
     * 修改保存用户信息
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    @Transactional
    public int updateUser(SysUserVo user) {
        Long userId = user.getUserId();
        resolveUserAccount(user);
        fillSensitiveCrypto(user);
        // 删除用户与角色关联
        userRoleMapper.deleteUserRoleByUserId(userId);
        // 新增用户与角色管理
        insertUserRole(user);
        return userMapper.updateUser(user);
    }

    /**
     * 修改保存用户信息
     */
    @Override
    @Transactional
    public int updateUser(SysUserSaveReq req) {
        SysUserVo user = req.toEntity();
        checkUserAllowed(user);
        if (StringUtils.isNotEmpty(user.getPassword())) {
            user.setPassword(SecurityUtils.encryptPassword(user.getPassword()));
        } else {
            user.setPassword(null);
        }
        return updateUser(user);
    }

    /**
     * 用户授权角色
     *
     * @param userId  用户ID
     * @param roleIds 角色组
     */
    @Override
    @Transactional
    public void insertUserAuth(Long userId, Long[] roleIds) {
        userRoleMapper.deleteUserRoleByUserId(userId);
        insertUserRole(userId, roleIds);
    }

    /**
     * 用户授权角色
     */
    @Override
    @Transactional
    public void insertUserAuth(SysUserAuthRoleReq req) {
        checkUserAllowed(req.getUserId());
        insertUserAuth(req.getUserId(), req.getRoleIds());
    }

    /**
     * 修改用户状态
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    public int updateUserStatus(SysUserVo user) {
        return userMapper.updateUserStatus(user.getUserId(), user.getStatus());
    }

    /**
     * 修改用户状态
     */
    @Override
    public int updateUserStatus(SysUserStatusReq req) {
        checkUserAllowed(req.getUserId());
        return userMapper.updateUserStatus(req.getUserId(), req.getStatus());
    }

    /**
     * 修改用户基本信息
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    public int updateUserProfile(SysUserVo user) {
        resolveUserAccount(user);
        fillSensitiveCrypto(user);
        return userMapper.updateUser(user);
    }

    /**
     * 修改用户头像
     *
     * @param userId     用户ID
     * @param avatar     头像缩略图 Base64
     * @param fullAvatar 头像原图 Base64（可空）
     * @return 结果
     */
    @Override
    public boolean updateUserAvatar(Long userId, String avatar, String fullAvatar) {
        return userMapper.updateUserAvatar(userId, avatar, fullAvatar) > 0;
    }

    /**
     * 更新用户登录信息（IP和登录时间）
     *
     * @param userId    用户ID
     * @param loginIp   登录IP地址
     * @param loginDate 登录时间
     * @return 结果
     */
    public void updateLoginInfo(Long userId, String loginIp, Date loginDate) {
        // tms 库无 login_ip/login_date，仅 touch update_time
        userMapper.updateLoginInfo(userId, loginIp, loginDate);
    }

    /**
     * 重置用户密码
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    public int resetPwd(SysUserVo user) {
        return userMapper.resetUserPwd(user.getUserId(), user.getPassword());
    }

    /**
     * 重置用户密码
     */
    @Override
    public int resetPwd(SysUserResetPwdReq req) {
        checkUserAllowed(req.getUserId());
        return resetUserPwd(req.getUserId(), SecurityUtils.encryptPassword(req.getPassword()));
    }

    /**
     * 重置用户密码
     *
     * @param userId   用户ID
     * @param password 密码
     * @return 结果
     */
    @Override
    public int resetUserPwd(Long userId, String password) {
        return userMapper.resetUserPwd(userId, password);
    }

    /**
     * 新增用户角色信息
     *
     * @param user 用户对象
     */
    public void insertUserRole(SysUserVo user) {
        this.insertUserRole(user.getUserId(), user.getRoleIds());
    }

    /** 登录账号只填了一侧时，把 account 与 userName 补成同一个值 */
    private void syncLoginName(SysUserVo user) {
        if (StringUtils.isEmpty(user.getAccount()) && StringUtils.isNotEmpty(user.getUserName())) {
            user.setAccount(user.getUserName());
        }
        if (StringUtils.isEmpty(user.getUserName()) && StringUtils.isNotEmpty(user.getAccount())) {
            user.setUserName(user.getAccount());
        }
    }

    /**
     * 入库前补齐账号字段。昵称缺省用登录账号，性别、年龄、地址、邮箱缺省给空值，避免非空列写入失败。
     */
    private void resolveUserAccount(SysUserVo user) {
        syncLoginName(user);
        if (StringUtils.isEmpty(user.getNickName())) {
            user.setNickName(StringUtils.isNotEmpty(user.getUserName()) ? user.getUserName() : user.getAccount());
        }
        if (StringUtils.isEmpty(user.getSex())) {
            user.setSex("男");
        }
        if (user.getAge() == null) {
            user.setAge(18);
        }
        if (user.getAddress() == null) {
            user.setAddress("");
        }
        if (user.getEmail() == null) {
            user.setEmail("");
        }
        if (user.getPhonenumber() == null) {
            user.setPhonenumber("");
        }
    }

    /**
     * 按明文手机号/身份证生成并写入密文与密钥（脱敏值或空值不处理）
     */
    private void fillSensitiveCrypto(SysUserVo user) {
        String phone = user.getPhonenumber();
        if (StringUtils.isNotEmpty(phone) && !SensitiveDataCrypto.isMasked(phone)) {
            SensitiveCryptoResult phoneEnc = SensitiveDataCrypto.encrypt(phone, DesensitizedType.PHONE);
            user.setPhoneCipher(phoneEnc.getCipherText());
            user.setPhoneSecretKey(phoneEnc.getSecretKey());
        } else if (StringUtils.isEmpty(phone)) {
            user.setPhoneCipher("");
            user.setPhoneSecretKey("");
        }

        String idCard = user.getIdCard();
        if (StringUtils.isNotEmpty(idCard) && !SensitiveDataCrypto.isMasked(idCard)) {
            SensitiveCryptoResult idEnc = SensitiveDataCrypto.encrypt(idCard, DesensitizedType.ID_CARD);
            user.setIdCardCipher(idEnc.getCipherText());
            user.setIdCardSecretKey(idEnc.getSecretKey());
        } else if (StringUtils.isEmpty(idCard)) {
            user.setIdCardCipher("");
            user.setIdCardSecretKey("");
        }
    }

    /**
     * 列表查询时补齐缺失的密文/密钥，返回是否需要落库
     */
    private boolean ensureSensitiveCrypto(SysUserVo user) {
        boolean changed = false;
        String phone = user.getPhonenumber();
        if (StringUtils.isNotEmpty(phone) && !SensitiveDataCrypto.isMasked(phone)
                && (StringUtils.isEmpty(user.getPhoneCipher()) || StringUtils.isEmpty(user.getPhoneSecretKey()))) {
            SensitiveCryptoResult phoneEnc = SensitiveDataCrypto.encrypt(phone, DesensitizedType.PHONE);
            user.setPhoneCipher(phoneEnc.getCipherText());
            user.setPhoneSecretKey(phoneEnc.getSecretKey());
            changed = true;
        }
        String idCard = user.getIdCard();
        if (StringUtils.isNotEmpty(idCard) && !SensitiveDataCrypto.isMasked(idCard)
                && (StringUtils.isEmpty(user.getIdCardCipher()) || StringUtils.isEmpty(user.getIdCardSecretKey()))) {
            SensitiveCryptoResult idEnc = SensitiveDataCrypto.encrypt(idCard, DesensitizedType.ID_CARD);
            user.setIdCardCipher(idEnc.getCipherText());
            user.setIdCardSecretKey(idEnc.getSecretKey());
            changed = true;
        }
        return changed;
    }

    /**
     * 新增用户角色信息
     *
     * @param userId  用户ID
     * @param roleIds 角色组
     */
    public void insertUserRole(Long userId, Long[] roleIds) {
        if (StringUtils.isNotEmpty(roleIds)) {
            // 新增用户与角色管理
            List<SysUserRole> list = new ArrayList<SysUserRole>(roleIds.length);
            for (Long roleId : roleIds) {
                SysUserRole ur = new SysUserRole();
                ur.setUserId(userId);
                ur.setRoleId(roleId);
                list.add(ur);
            }
            userRoleMapper.batchUserRole(list);
        }
    }

    /**
     * 通过用户ID删除用户
     *
     * @param userId 用户ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteUserById(Long userId) {
        // 删除用户与角色关联
        userRoleMapper.deleteUserRoleByUserId(userId);
        return userMapper.deleteUserById(userId);
    }

    /**
     * 批量删除用户信息
     *
     * @param userIds 需要删除的用户ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteUserByIds(Long[] userIds) {
        for (Long userId : userIds) {
            checkUserAllowed(new SysUserVo(userId));
        }
        // 删除用户与角色关联
        userRoleMapper.deleteUserRole(userIds);
        return userMapper.deleteUserByIds(userIds);
    }

    /**
     * 导入用户数据
     *
     * @param userList        用户数据列表
     * @param isUpdateSupport 是否更新支持，如果已存在，则进行更新数据
     * @param operName        操作用户
     * @return 结果
     */
    @Override
    public String importUser(List<SysUserVo> userList, Boolean isUpdateSupport, String operName) {
        if (StringUtils.isNull(userList) || userList.size() == 0) {
            throw new ServiceException("导入用户数据不能为空！");
        }
        int successNum = 0;
        int failureNum = 0;
        StringBuilder successMsg = new StringBuilder();
        StringBuilder failureMsg = new StringBuilder();
        for (SysUserVo user : userList) {
            try {
                syncLoginName(user);
                // 验证是否存在这个用户
                SysUserVo u = userMapper.selectUserByUserName(user.getUserName());
                if (StringUtils.isNull(u)) {
                    BeanValidators.validateWithException(validator, user);
                    String password = TmsConfig.getInitPassword();
                    user.setPassword(SecurityUtils.encryptPassword(password));
                    resolveUserAccount(user);
                    userMapper.insertUser(user);
                    successNum++;
                    successMsg.append("<br/>" + successNum + "、账号 " + user.getUserName() + " 导入成功");
                } else if (isUpdateSupport) {
                    BeanValidators.validateWithException(validator, user);
                    checkUserAllowed(u);
                    user.setUserId(u.getUserId());
                    resolveUserAccount(user);
                    userMapper.updateUser(user);
                    successNum++;
                    successMsg.append("<br/>" + successNum + "、账号 " + user.getUserName() + " 更新成功");
                } else {
                    failureNum++;
                    failureMsg.append("<br/>" + failureNum + "、账号 " + user.getUserName() + " 已存在");
                }
            } catch (Exception e) {
                failureNum++;
                String msg = "<br/>" + failureNum + "、账号 " + user.getUserName() + " 导入失败：";
                failureMsg.append(msg + e.getMessage());
                log.error(msg, e);
            }
        }
        if (failureNum > 0) {
            failureMsg.insert(0, "很抱歉，导入失败！共 " + failureNum + " 条数据格式不正确，错误如下：");
            throw new ServiceException(failureMsg.toString());
        } else {
            successMsg.insert(0, "恭喜您，数据已全部导入成功！共 " + successNum + " 条，数据如下：");
        }
        return successMsg.toString();
    }
}
