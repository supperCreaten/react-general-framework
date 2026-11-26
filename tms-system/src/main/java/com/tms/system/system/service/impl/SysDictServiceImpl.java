package com.tms.system.system.service.impl;

import com.tms.common.utils.bean.BeanUtils;
import com.tms.system.system.domain.dto.SysDictDataSaveReq;
import com.tms.system.system.domain.dto.SysDictQuery;
import com.tms.system.system.domain.dto.SysDictSaveReq;
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

    private void selectDictByCode(SysDictSaveReq dict) {
        String dictCode = dict.getDictCode();
        Long dictId = dict.getDictId();
        SysDictSaveReq row = dictMapper.selectDictByCode(dictCode);
        if (dictId == null) {
            if (row != null && row.getDictCode().equals(dictCode)) {
                throw new IllegalArgumentException("字典编码已存在");
            }
        } else {
            if (row != null && row.getDictCode().equals(dictCode) && !dictId.equals(row.getDictId())) {
                throw new IllegalArgumentException("字典编码已存在");
            }
        }
    }

    /**
     * 查询字典类型列表
     */
    @Override
    public List<SysDictSaveReq> selectDictList(SysDictQuery query) {
        SysDictSaveReq dict = new SysDictSaveReq();
        if (query != null) {
            BeanUtils.copyBeanProp(dict, query);
        }
        return dictMapper.selectDictList(dict);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    /**
     * 新增字典类型
     */
    public void insertDict(SysDictSaveReq req) {
        selectDictByCode(req);
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

    @Override
    @Transactional(rollbackFor = Exception.class)
    /**
     * 修改字典类型
     */
    public void updateDict(SysDictSaveReq req) {
        if (req.getDictId() == null) {
            throw new IllegalArgumentException("主键id不能为空");
        }
        selectDictByCode(req);
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
    public SysDictSaveReq selectDictByDictId(Long id) {
        SysDictSaveReq dict = dictMapper.selectDictById(id);
        List<SysDictDataSaveReq> items = dictDataMapper.selectDictDataByDictId(id);
        dict.setItems(items);
        return dict;
    }

    /**
     * 按编码查询字典项
     */
    @Override
    public List<SysDictDataSaveReq> selectDictDataByCode(String dictCode) {
        SysDictSaveReq row = dictMapper.selectDictByCode(dictCode);
        if (row == null) {
            throw new IllegalArgumentException("未找到");
        }
        Long dictId = row.getDictId();
        return dictDataMapper.selectDictDataByDictId(dictId);
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

