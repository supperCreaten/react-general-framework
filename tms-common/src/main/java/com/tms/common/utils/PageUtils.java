package com.tms.common.utils;

import com.github.pagehelper.PageHelper;
import com.tms.common.core.page.PageDomain;
import com.tms.common.core.page.TableSupport;
import com.tms.common.utils.sql.SqlUtil;

/**
 * 分页工具类
 * 
 * @author tms
 */
public class PageUtils extends PageHelper
{
    /**
     * 设置请求分页数据。
     * 先 clearPage，避免线程池复用时残留分页污染后续无分页查询（如 /authRoutes）。
     */
    public static void startPage()
    {
        PageHelper.clearPage();
        PageDomain pageDomain = TableSupport.buildPageRequest();
        Integer pageNum = pageDomain.getPageNum();
        Integer pageSize = pageDomain.getPageSize();
        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        Boolean reasonable = pageDomain.getReasonable();
        PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);
    }

    /**
     * 清理分页的线程变量
     */
    public static void clearPage()
    {
        PageHelper.clearPage();
    }
}
