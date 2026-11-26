package com.tms.system.system.service.impl;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.file.FileUtils;
import com.tms.system.system.domain.SysFileInfo;
import com.tms.system.system.mapper.SysFileInfoMapper;
import com.tms.system.system.service.ISysFileInfoService;

/**
 * 上传文件元数据 服务实现
 *
 * @author tms
 */
@Service
public class SysFileInfoServiceImpl implements ISysFileInfoService {
    @Autowired
    private SysFileInfoMapper fileInfoMapper;

    /**
     * 保存上传文件
     */
    @Override
    public SysFileInfo saveUploadFile(MultipartFile file, String storedPath, String url) {
        SysFileInfo info = new SysFileInfo();
        info.setOriginalFilename(file.getOriginalFilename());
        info.setFileName(storedPath);
        info.setNewFileName(FileUtils.getName(storedPath));
        info.setUrl(url);
        info.setFileSize(file.getSize());
        info.setFileType(FilenameUtils.getExtension(file.getOriginalFilename()));
        info.setContentType(StringUtils.nvl(file.getContentType(), ""));
        fileInfoMapper.insertFile(info);
        return info;
    }

    /**
     * 根据ID查询文件
     */
    @Override
    public SysFileInfo selectFileById(Long fileId) {
        return fileInfoMapper.selectFileById(fileId);
    }
}

