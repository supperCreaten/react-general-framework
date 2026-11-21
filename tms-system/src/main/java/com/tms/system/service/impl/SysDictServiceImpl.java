package com.tms.system.service.impl;

import com.tms.common.utils.bean.BeanUtils;
import com.tms.system.domain.dto.SysDictDataSaveReq;
import com.tms.system.domain.dto.SysDictQuery;
import com.tms.system.domain.dto.SysDictSaveReq;
import com.tms.system.mapper.SysDictDataMapper;
import com.tms.system.mapper.SysDictMapper;
import com.tms.system.service.SysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 字典 业务层处理
 *
 * @author tms
 */
@Service
public class SysDictServiceImpl implements SysDictService {
    @Autowired
    private SysDictMapper dictMapper;

    @Autowired
    private SysDictDataMapper dictDataMapper;

    /**
     * 校验字典编码是否唯一
     *
     * @param dict 字典信息
     */
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
     * 查询系统字典列表
     *
     * @param query 字典查询条件
     * @return 字典列表
     */
    @Override
    public List<SysDictSaveReq> selectDictList(SysDictQuery query) {
        SysDictSaveReq dict = new SysDictSaveReq();
        if (query != null) {
            BeanUtils.copyBeanProp(dict, query);
        }
        return dictMapper.selectDictList(dict);
    }

    /**
     * 新增保存菜单信息
     *
     * @param req 字典信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
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

    /**
     * 新增保存菜单信息
     *
     * @param req 字典信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
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
     * 根据主键id查询字典列表
     *
     * @param id 主键ID
     * @return 字典详情
     */
    @Override
    public SysDictSaveReq selectDictByDictId(Long id) {
        SysDictSaveReq dict = dictMapper.selectDictById(id);
        List<SysDictDataSaveReq> items = dictDataMapper.selectDictDataByDictId(id);
        dict.setItems(items);
        return dict;
    }

    /**
     * 根据字典编码查询字典列表
     *
     * @param dictCode 字典编码
     * @return 字典列表
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
     * 根据主键id删除字典列表
     *
     * @param ids 主键ID集合
     */
    @Override
    public void deleteDictById(List<Long> ids) {
        for (Long id : ids) {
            dictMapper.deleteDIctById(id);
            dictDataMapper.deleteDictDataByDictId(id);
        }
    }
}
