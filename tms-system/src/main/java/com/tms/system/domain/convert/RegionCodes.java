package com.tms.system.domain.convert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.tms.common.utils.StringUtils;

/**
 * 省市区编码数组 ↔ 三字段拆分
 */
public final class RegionCodes {
    private RegionCodes() {
    }

    /**
     * 从省市区编码列表中按索引取单个编码
     *
     * @param codes 编码列表
     * @param index 下标
     * @return 对应编码，越界或为空时返回 null
     */
    public static String at(List<String> codes, int index) {
        if (codes == null || index < 0 || index >= codes.size()) {
            return null;
        }
        String code = codes.get(index);
        return StringUtils.isEmpty(code) ? null : code;
    }

    /**
     * 将省、市、区三字段合并为编码列表（跳过空值）
     *
     * @param province 省编码
     * @param city     市编码
     * @param district 区编码
     * @return 非空编码组成的列表，全空时返回空列表
     */
    public static List<String> toList(String province, String city, String district) {
        if (StringUtils.isEmpty(province) && StringUtils.isEmpty(city) && StringUtils.isEmpty(district)) {
            return Collections.emptyList();
        }
        List<String> list = new ArrayList<>(3);
        if (StringUtils.isNotEmpty(province)) {
            list.add(province);
        }
        if (StringUtils.isNotEmpty(city)) {
            list.add(city);
        }
        if (StringUtils.isNotEmpty(district)) {
            list.add(district);
        }
        return list;
    }
}
