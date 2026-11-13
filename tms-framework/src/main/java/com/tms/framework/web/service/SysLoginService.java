package com.tms.framework.web.service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import com.tms.common.config.TmsConfig;
import com.tms.common.constant.Constants;
import com.tms.common.constant.UserConstants;
import com.tms.common.core.service.ISysLoginService;
import com.tms.common.core.domain.model.LoginUser;
import com.tms.common.exception.ServiceException;
import com.tms.common.exception.user.BlackListException;
import com.tms.common.exception.user.UserNotExistsException;
import com.tms.common.exception.user.UserPasswordNotMatchException;
import com.tms.common.utils.DateUtils;
import com.tms.common.utils.MessageUtils;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.ip.IpUtils;
import com.tms.framework.manager.AsyncManager;
import com.tms.framework.manager.factory.AsyncFactory;
import com.tms.framework.security.context.AuthenticationContextHolder;
import com.tms.system.service.ISysUserService;

/**
 * 登录校验方法
 *
 * @author tms
 */
@Component
public class SysLoginService implements ISysLoginService {
    @Autowired
    private TokenService tokenService;

    @Resource
    private AuthenticationManager authenticationManager;

    @Autowired
    private ISysUserService userService;

    @Override
    public String login(String username, String password) {
        return doLogin(username, password, null);
    }

    @Override
    public String login(String username, String password, HttpServletResponse response) {
        return doLogin(username, password, response);
    }

    private String doLogin(String username, String password, HttpServletResponse response) {
        loginPreCheck(username, password);
        Authentication authentication;
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            AuthenticationContextHolder.setContext(authenticationToken);
            authentication = authenticationManager.authenticate(authenticationToken);
        } catch (Exception e) {
            if (e instanceof BadCredentialsException) {
                AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.password.not.match")));
                throw new UserPasswordNotMatchException();
            }
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, e.getMessage()));
            throw new ServiceException(e.getMessage());
        } finally {
            AuthenticationContextHolder.clearContext();
        }
        AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_SUCCESS, MessageUtils.message("user.login.success")));
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        if (loginUser != null) {
            recordLoginInfo(loginUser.getUserId());
        }
        String accessToken = null;
        if (loginUser != null) {
            accessToken = tokenService.createToken(loginUser);
        }
        if (response != null) {
            if (loginUser != null) {
                tokenService.createRefreshToken(loginUser, response);
            }
        }
        return accessToken;
    }

    public void loginPreCheck(String username, String password) {
        if (StringUtils.isEmpty(username) || StringUtils.isEmpty(password)) {
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("not.null")));
            throw new UserNotExistsException();
        }
        if (password.length() < UserConstants.PASSWORD_MIN_LENGTH
                || password.length() > UserConstants.PASSWORD_MAX_LENGTH) {
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.password.not.match")));
            throw new UserPasswordNotMatchException();
        }
        if (username.length() < UserConstants.USERNAME_MIN_LENGTH
                || username.length() > UserConstants.USERNAME_MAX_LENGTH) {
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.password.not.match")));
            throw new UserPasswordNotMatchException();
        }
        String blackStr = TmsConfig.getBlackIPList();
        if (IpUtils.isMatchedIp(blackStr, IpUtils.getIpAddr())) {
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("login.blocked")));
            throw new BlackListException();
        }
    }

    public void recordLoginInfo(Long userId) {
        userService.updateLoginInfo(userId, IpUtils.getIpAddr(), DateUtils.getNowDate());
    }
}
