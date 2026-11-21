package com.tms.system.mapper;

import com.tms.system.domain.dto.SysDictDataSaveReq;

import java.util.List;

/**
 * 字典数据表 数据层
 *
 * @author tms
 */
public interface SysDictDataMapper {
    /**
     * 根据条件查询字典数据列表
     *
     * @param dictData 字典数据查询条件
     * @return 字典数据列表
     */
    List<SysDictDataSaveReq> selectDictDataList(SysDictDataSaveReq dictData);

    /**
     * 新增字典配置
     *
     * @param dictData 字典信息
     */
    void insertDictData(SysDictDataSaveReq dictData);

    /**
     * 根据主键id查询字典列表
     *
     * @param id 主表id
     * @return 字典列表
     */
    List<SysDictDataSaveReq> selectDictDataByDictId(Long id);

    /**
     * 更新字典配置
     *
     * @param dictData 字典信息
     */
    int updateDictData(SysDictDataSaveReq dictData);

    /**
     * 删除字典配置
     *
     * @param id 主键id
     */
    int deleteDictDataById(Long id);
    /**
     * 删除字典配置
     *
     * @param id 主键id
     */
    int deleteDictDataByDictId(Long id);
}
