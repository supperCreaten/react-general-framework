package com.tms.system.system.service;

import com.tms.system.system.domain.dto.SysDictDataSaveReq;
import com.tms.system.system.domain.vo.SysDictDataVo;

import java.util.List;

/**
 * 字典数据 业务层
 */
public interface SysDictDataService {
    /**
     * 新增保存菜单信息
     *
     * @param dictData 字典信息
     */
    void insertDictData(List<SysDictDataSaveReq> dictData);

    /**
     * 新增保存菜单信息
     *
     * @param dictData 字典信息
     */
    void updateDictData(List<SysDictDataSaveReq> dictData);

    /**
     * 根据主键id查询字典列表
     *
     * @param id 主表id
     * @return 字典列表
     */
    List<SysDictDataVo> selectDictDataByDictId(Long id);

}
