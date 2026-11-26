package com.tms.common.filter;

import com.alibaba.fastjson2.filter.SimplePropertyPreFilter;

/**
 * 排除JSON敏感属性
 * 
 * @author tms
 */
public class PropertyPreExcludeFilter extends SimplePropertyPreFilter
{
    /**
     * PropertyPreExcludeFilter
     */
    public PropertyPreExcludeFilter()
    {
    }

    /**
     * 追加排除属性
     */
    public PropertyPreExcludeFilter addExcludes(String... filters)
    {
        for (int i = 0; i < filters.length; i++)
        {
            this.getExcludes().add(filters[i]);
        }
        return this;
    }
}
