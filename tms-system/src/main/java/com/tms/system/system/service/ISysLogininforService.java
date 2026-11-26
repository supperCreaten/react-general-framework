package com.tms.system.system.service;

import java.util.List;

import com.tms.system.system.domain.dto.SysLogininforQuery;
import com.tms.system.system.domain.dto.SysLogininforSaveReq;
import com.tms.system.system.domain.vo.SysLogininforVo;

/**
 * 系统访问日志情况信息 服务层
 *
 * @author tms
 */
public interface ISysLogininforService {
    /**
     * 新增系统登录日志
     *
     * @param logininfor 访问日志
     */
    void insertLogininfor(SysLogininforSaveReq logininfor);

    /**
     * 查询系统登录日志集合
     *
     * @param query 查询条件
     * @return 登录记录集合
     */
    List<SysLogininforVo> selectLogininforList(SysLogininforQuery query);

    /**
     * 查询登录日志详情
     */
    SysLogininforVo selectLogininforById(Long infoId);

    /**
     * 批量删除系统登录日志
     *
     * @param infoIds 需要删除的登录日志ID
     * @return 结果
     */
    int deleteLogininforByIds(Long[] infoIds);

    /**
     * 清空系统登录日志
     */
    void cleanLogininfor();

    /**
     * 按天数清理登录日志
     */
    void cleanLogininforByDays(int days);
}
