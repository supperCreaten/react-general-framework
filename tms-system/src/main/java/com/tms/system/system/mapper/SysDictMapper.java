package com.tms.system.system.mapper;

import com.tms.system.system.domain.dto.SysDictQuery;
import com.tms.system.system.domain.dto.SysDictSaveReq;
import com.tms.system.system.domain.vo.SysDictVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 字典类型 数据层
 */
public interface SysDictMapper {
    /**
     * 查询字典类型列表
     *
     * @param query 查询条件
     * @return 字典列表
     */
    List<SysDictVo> selectDictList(SysDictQuery query);

    /**
     * 查询全部字典类型
     *
     * @return 字典列表
     */
    List<SysDictVo> selectDictAllList();

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
    SysDictVo selectDictById(Long id);

    /**
     * 根据字典编码查询字典列表
     *
     * @param dictCode 字典编码
     * @return 字典详情
     */
    SysDictVo selectDictByCode(@Param("dictCode") String dictCode);

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
