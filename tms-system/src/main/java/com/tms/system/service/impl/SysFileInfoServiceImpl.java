package com.tms.system.service.impl;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.tms.common.utils.StringUtils;
import com.tms.common.utils.file.FileUtils;
import com.tms.system.domain.SysFileInfo;
import com.tms.system.mapper.SysFileInfoMapper;
import com.tms.system.service.ISysFileInfoService;

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
     * 保存上传文件元数据
     *
     * @param file       原始上传文件
     * @param storedPath 存储路径（/profile/upload/...）
     * @param url        完整访问 URL
     * @return 已落库记录（含 fileId）
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
     * 按主键查询
     *
     * @param fileId 文件ID
     * @return 文件信息
     */
    @Override
    public SysFileInfo selectFileById(Long fileId) {
        return fileInfoMapper.selectFileById(fileId);
    }
}
