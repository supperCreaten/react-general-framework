package com.tms.system.mapper;

import com.tms.system.domain.dto.SysDictSaveReq;

import java.util.List;

/**
 * 字典类型表 数据层
 *
 * @author tms
 */
public interface SysDictMapper {
    /**
     * 根据条件查询字典类型列表
     *
     * @param dict 字典查询条件
     * @return 字典类型列表
     */
    List<SysDictSaveReq> selectDictList(SysDictSaveReq dict);

    /**
     * 查询全部字典类型列表
     *
     * @return 字典类型列表
     */
    List<SysDictSaveReq> selectDictAllList();

    /**
     * 新增字典
     *
     * @param dict 字典信息
     */
    int insertDict(SysDictSaveReq dict);

    /**
     * 根据主键id查询字典列表
     *
     * @param id 主键ID
     * @return 字典详情
     */
    SysDictSaveReq selectDictById(Long id);
    /**
     * 根据字典编码查询字典列表
     *
     * @param dictCode 字典编码
     * @return 字典详情
     */
    SysDictSaveReq selectDictByCode(String dictCode);
    /**
     * 更新字典配置
     *
     * @param dict 字典信息
     */
    int updateDict(SysDictSaveReq dict);

    /**
     * 删除字典配置
     *
     * @param id 主键id
     */
    int deleteDIctById(Long id);
}
