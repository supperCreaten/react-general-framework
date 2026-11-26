package com.tms.system.system.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tms.system.system.domain.dto.SysOperLogQuery;
import com.tms.system.system.domain.dto.SysOperLogSaveReq;
import com.tms.system.system.domain.vo.SysOperLogVo;
import com.tms.system.system.mapper.SysOperLogMapper;
import com.tms.system.system.service.ISysOperLogService;

/**
 * 操作日志 业务层处理
 */
@Service
public class SysOperLogServiceImpl implements ISysOperLogService {
    @Autowired
    private SysOperLogMapper operLogMapper;

    /**
     * 新增操作日志
     */
    @Override
    public void insertOperlog(SysOperLogSaveReq operLog) {
        operLogMapper.insertOperlog(operLog);
    }

    /**
     * 查询操作日志列表
     */
    @Override
    public List<SysOperLogVo> selectOperLogList(SysOperLogQuery query) {
        return operLogMapper.selectOperLogList(query == null ? new SysOperLogQuery() : query);
    }

    /**
     * 按主键查询操作日志
     */
    @Override
    public SysOperLogVo selectOperLogById(Long operId) {
        return operLogMapper.selectOperLogById(operId);
    }

    /**
     * 批量删除操作日志
     */
    @Override
    public int deleteOperLogByIds(Long[] operIds) {
        return operLogMapper.deleteOperLogByIds(operIds);
    }

    /**
     * 清空操作日志
     */
    @Override
    public void cleanOperLog() {
        operLogMapper.cleanOperLog();
    }

    /**
     * 清理指定天数之前的操作日志
     */
    @Override
    public void cleanOperLogByDays(int days) {
        operLogMapper.cleanOperLogByDays(days);
    }
}
