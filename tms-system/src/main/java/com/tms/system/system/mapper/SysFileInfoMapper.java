package com.tms.system.system.mapper;

import com.tms.system.system.domain.dto.SysFileInfoSaveReq;
import com.tms.system.system.domain.vo.SysFileInfoVo;

/**
 * 上传文件元数据 数据层
 *
 * @author tms
 */
public interface SysFileInfoMapper {
    /**
     * 新增文件记录
     */
    int insertFile(SysFileInfoSaveReq fileInfo);

    /**
     * 按主键查询
     */
    SysFileInfoVo selectFileById(Long fileId);
}
