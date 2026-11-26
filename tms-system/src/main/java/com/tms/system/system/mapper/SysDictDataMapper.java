package com.tms.system.system.mapper;

import com.tms.system.system.domain.dto.SysDictDataSaveReq;
import com.tms.system.system.domain.vo.SysDictDataVo;

import java.util.List;

/**
 * 字典数据 数据层
 */
public interface SysDictDataMapper {
    /**
     * 查询字典数据列表
     *
     * @param dictData 查询条件
     * @return 字典数据列表
     */
    List<SysDictDataVo> selectDictDataList(SysDictDataSaveReq dictData);

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
    List<SysDictDataVo> selectDictDataByDictId(Long id);

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
