package com.tms.system.system.domain.convert;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import com.github.pagehelper.Page;

/**
 * 分页结果映射，保留 PageHelper 的总数。
 */
public final class PageVos {
    private PageVos() {
    }

    public static <S, T> List<T> map(List<S> source, Function<S, T> mapper) {
        if (source == null) {
            return List.of();
        }
        if (source instanceof Page<?> page) {
            Page<T> target = new Page<>(page.getPageNum(), page.getPageSize());
            target.setTotal(page.getTotal());
            for (S item : source) {
                target.add(mapper.apply(item));
            }
            return target;
        }
        return source.stream().map(mapper).collect(Collectors.toList());
    }
}
