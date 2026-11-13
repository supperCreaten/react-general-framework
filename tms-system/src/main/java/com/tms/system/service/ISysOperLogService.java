package com.tms.system.service;

import java.util.List;
import com.tms.system.domain.SysOperLog;

public interface ISysOperLogService
{
    void insertOperlog(SysOperLog operLog);

    List<SysOperLog> selectOperLogList(SysOperLog operLog);

    SysOperLog selectOperLogById(Long operId);

    int deleteOperLogByIds(Long[] operIds);

    void cleanOperLog();

    void cleanOperLogByDays(int days);
}
