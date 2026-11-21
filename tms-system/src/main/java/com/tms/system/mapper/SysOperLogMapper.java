package com.tms.system.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import com.tms.system.domain.SysOperLog;

/**
 * 操作日志表 数据层
 *
 * @author tms
 */
public interface SysOperLogMapper {
    /**
     * 新增操作日志
     *
     * @param operLog 操作日志对象
     */
    void insertOperlog(SysOperLog operLog);

    /**
     * 查询操作日志集合
     *
     * @param operLog 操作日志对象
     * @return 操作记录集合
     */
    List<SysOperLog> selectOperLogList(SysOperLog operLog);

    /**
     * 查询操作日志详情
     *
     * @param operId 操作日志ID
     * @return 操作日志对象
     */
    SysOperLog selectOperLogById(Long operId);

    /**
     * 批量删除操作日志
     *
     * @param operIds 需要删除的操作日志ID
     * @return 结果
     */
    int deleteOperLogByIds(@Param("operIds") Long[] operIds);

    /**
     * 清空操作日志
     *
     * @return 结果
     */
    int cleanOperLog();

    /**
     * 按天数清理操作日志
     *
     * @param days 保留最近天数，早于该天数的记录将被删除
     * @return 结果
     */
    int cleanOperLogByDays(@Param("days") int days);
}