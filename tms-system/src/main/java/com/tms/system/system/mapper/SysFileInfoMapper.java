package com.tms.system.system.mapper;

import com.tms.system.system.domain.SysFileInfo;

/**
 * 上传文件元数据 数据层
 *
 * @author tms
 */
public interface SysFileInfoMapper {
    /**
     * 新增文件记录
     */
    int insertFile(SysFileInfo fileInfo);

    /**
     * 按主键查询
     */
    SysFileInfo selectFileById(Long fileId);
}
