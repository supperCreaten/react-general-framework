package com.tms.system.domain.convert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.tms.common.core.domain.entity.SysPost;
import com.tms.system.domain.dto.SysPostQuery;
import com.tms.system.domain.dto.SysPostSaveReq;
import com.tms.system.domain.vo.SysPostVo;

/**
 * 岗位 DTO / Entity / VO 转换
 */
public final class SysPostConvert {
    private SysPostConvert() {
    }

    /**
     * 查询条件转岗位实体（用于列表筛选）
     *
     * @param query 岗位查询条件
     * @return 岗位实体
     */
    public static SysPost toEntity(SysPostQuery query) {
        SysPost post = new SysPost();
        if (query == null) {
            return post;
        }
        post.setPostCode(query.getPostCode());
        post.setPostName(query.getPostName());
        post.setDeptId(query.getDeptId());
        post.setStatus(query.getStatus());
        return post;
    }

    /**
     * 保存请求转岗位实体
     *
     * @param req 岗位保存请求
     * @return 岗位实体
     */
    public static SysPost toEntity(SysPostSaveReq req) {
        SysPost post = new SysPost();
        if (req == null) {
            return post;
        }
        post.setPostId(req.getPostId());
        post.setPostCode(req.getPostCode());
        post.setPostName(req.getPostName());
        post.setDeptId(req.getDeptId());
        post.setPostSort(req.getPostSort());
        post.setStatus(req.getStatus());
        post.setRemark(req.getRemark());
        return post;
    }

    /**
     * 岗位实体转展示 VO
     *
     * @param post 岗位实体
     * @return 岗位 VO，入参为 null 时返回 null
     */
    public static SysPostVo toVo(SysPost post) {
        if (post == null) {
            return null;
        }
        SysPostVo vo = new SysPostVo();
        vo.setPostId(post.getPostId());
        vo.setPostCode(post.getPostCode());
        vo.setPostName(post.getPostName());
        vo.setDeptId(post.getDeptId());
        vo.setPostSort(post.getPostSort());
        vo.setStatus(post.getStatus());
        vo.setCreateBy(post.getCreateBy());
        vo.setCreateTime(post.getCreateTime());
        vo.setRemark(post.getRemark());
        return vo;
    }

    /**
     * 岗位实体列表转 VO 列表
     *
     * @param list 岗位实体列表
     * @return VO 列表
     */
    public static List<SysPostVo> toVoList(List<SysPost> list) {
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        }
        List<SysPostVo> result = new ArrayList<>(list.size());
        for (SysPost post : list) {
            result.add(toVo(post));
        }
        return result;
    }
}
