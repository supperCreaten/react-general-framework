package com.tms.system.system.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import com.tms.system.system.domain.SysOperLog;

/**
 * 操作日志 数据层
 */
public interface SysOperLogMapper {
    /**
     * 新增操作日志
     *
     * @param operLog 操作日志
     */
    void insertOperlog(SysOperLog operLog);

    /**
     * 查询操作日志列表
     *
     * @param operLog 查询条件
     * @return 操作日志列表
     */
    List<SysOperLog> selectOperLogList(SysOperLog operLog);

    /**
     * 按主键查询操作日志
     *
     * @param operId 日志ID
     * @return 操作日志
     */
    SysOperLog selectOperLogById(Long operId);

    /**
     * 批量删除操作日志
     *
     * @param operIds 日志ID数组
     * @return 影响行数
     */
    int deleteOperLogByIds(@Param("operIds") Long[] operIds);

    /**
     * 清空操作日志
     *
     * @return 影响行数
     */
    int cleanOperLog();

    /**
     * 清理指定天数之前的操作日志
     *
     * @param days 保留天数
     * @return 影响行数
     */
    int cleanOperLogByDays(@Param("days") int days);
}
