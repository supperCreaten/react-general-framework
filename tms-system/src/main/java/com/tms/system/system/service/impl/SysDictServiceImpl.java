package com.tms.system.system.service.impl;

import com.tms.system.system.domain.dto.SysDictDataSaveReq;
import com.tms.system.system.domain.dto.SysDictQuery;
import com.tms.system.system.domain.dto.SysDictSaveReq;
import com.tms.system.system.domain.vo.SysDictDataVo;
import com.tms.system.system.domain.vo.SysDictVo;
import com.tms.system.system.mapper.SysDictDataMapper;
import com.tms.system.system.mapper.SysDictMapper;
import com.tms.system.system.service.SysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 字典类型 业务层处理
 */
@Service
public class SysDictServiceImpl implements SysDictService {
    @Autowired
    private SysDictMapper dictMapper;

    @Autowired
    private SysDictDataMapper dictDataMapper;

    private void assertDictCodeUnique(SysDictSaveReq dict) {
        String dictCode = dict.getDictCode();
        Long dictId = dict.getDictId();
        SysDictVo row = dictMapper.selectDictByCode(dictCode);
        if (row == null || !dictCode.equals(row.getDictCode())) {
            return;
        }
        if (dictId == null || !dictId.equals(row.getDictId())) {
            throw new IllegalArgumentException("字典编码已存在");
        }
    }

    /**
     * 查询字典类型列表
     */
    @Override
    public List<SysDictVo> selectDictList(SysDictQuery query) {
        return dictMapper.selectDictList(query == null ? new SysDictQuery() : query);
    }

    /**
     * 新增字典类型
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void insertDict(SysDictSaveReq req) {
        assertDictCodeUnique(req);
        dictMapper.insertDict(req);
        Long dictId = req.getDictId();
        List<SysDictDataSaveReq> dictData = req.getItems();
        if (dictData == null) {
            return;
        }
        dictData.forEach(v -> {
            v.setDictId(dictId);
            dictDataMapper.insertDictData(v);
        });
    }

    /**
     * 修改字典类型
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateDict(SysDictSaveReq req) {
        if (req.getDictId() == null) {
            throw new IllegalArgumentException("主键id不能为空");
        }
        assertDictCodeUnique(req);
        dictMapper.updateDict(req);
        List<SysDictDataSaveReq> dictData = req.getItems();
        if (dictData == null) {
            return;
        }
        dictData.forEach(dictDataMapper::updateDictData);
    }

    /**
     * 根据ID查询字典类型
     */
    @Override
    public SysDictVo selectDictByDictId(Long id) {
        SysDictVo dict = dictMapper.selectDictById(id);
        List<SysDictDataVo> items = dictDataMapper.selectDictDataByDictId(id);
        dict.setItems(items);
        return dict;
    }

    /**
     * 按编码查询字典项
     */
    @Override
    public List<SysDictDataVo> selectDictDataByCode(String dictCode) {
        SysDictVo row = dictMapper.selectDictByCode(dictCode);
        if (row == null) {
            throw new IllegalArgumentException("未找到");
        }
        return dictDataMapper.selectDictDataByDictId(row.getDictId());
    }

    /**
     * 批量删除字典类型
     */
    @Override
    public void deleteDictById(List<Long> ids) {
        for (Long id : ids) {
            dictMapper.deleteDIctById(id);
            dictDataMapper.deleteDictDataByDictId(id);
        }
    }
}
