package com.tms.system.system.service;

import java.util.List;
import com.tms.system.system.domain.dto.SysOperLogQuery;
import com.tms.system.system.domain.dto.SysOperLogSaveReq;
import com.tms.system.system.domain.vo.SysOperLogVo;

/**
 * 操作日志 业务层
 */
public interface ISysOperLogService {
    /**
     * 新增操作日志
     *
     * @param operLog 操作日志
     */
    void insertOperlog(SysOperLogSaveReq operLog);

    /**
     * 查询操作日志列表
     *
     * @param query 查询条件
     * @return 操作日志列表
     */
    List<SysOperLogVo> selectOperLogList(SysOperLogQuery query);

    /**
     * 按主键查询操作日志
     *
     * @param operId 日志ID
     * @return 操作日志
     */
    SysOperLogVo selectOperLogById(Long operId);

    /**
     * 批量删除操作日志
     *
     * @param operIds 日志ID数组
     * @return 影响行数
     */
    int deleteOperLogByIds(Long[] operIds);

    /**
     * 清空操作日志
     */
    void cleanOperLog();

    /**
     * 清理指定天数之前的操作日志
     *
     * @param days 保留天数
     */
    void cleanOperLogByDays(int days);
}
