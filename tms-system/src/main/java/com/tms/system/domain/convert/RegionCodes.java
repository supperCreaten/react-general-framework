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

    public static String at(List<String> codes, int index) {
        if (codes == null || index < 0 || index >= codes.size()) {
            return null;
        }
        String code = codes.get(index);
        return StringUtils.isEmpty(code) ? null : code;
    }

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
