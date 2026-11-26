package com.tms.system.system.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tms.common.constant.UserConstants;
import com.tms.common.utils.StringUtils;
import com.tms.system.system.domain.dto.SysPostQuery;
import com.tms.system.system.domain.dto.SysPostSaveReq;
import com.tms.system.system.domain.vo.SysPostVo;
import com.tms.system.system.mapper.SysPostMapper;
import com.tms.system.system.service.ISysPostService;

/**
 * 岗位信息 服务实现
 *
 * @author tms
 */
@Service
public class SysPostServiceImpl implements ISysPostService {
    @Autowired
    private SysPostMapper postMapper;

    /**
     * 查询岗位列表
     */
    @Override
    public List<SysPostVo> selectPostList(SysPostQuery query) {
        return postMapper.selectPostList(query == null ? new SysPostQuery() : query);
    }

    /**
     * 根据ID查询岗位
     */
    @Override
    public SysPostVo selectPostById(Long postId) {
        return postMapper.selectPostById(postId);
    }

    /**
     * 校验岗位名称唯一
     */
    @Override
    public boolean checkPostNameUnique(SysPostSaveReq post) {
        long postId = StringUtils.isNull(post.getPostId()) ? -1L : post.getPostId();
        SysPostVo info = postMapper.checkPostNameUnique(post.getPostName());
        if (StringUtils.isNotNull(info) && info.getPostId() != postId) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验岗位编码唯一
     */
    @Override
    public boolean checkPostCodeUnique(SysPostSaveReq post) {
        long postId = StringUtils.isNull(post.getPostId()) ? -1L : post.getPostId();
        SysPostVo info = postMapper.checkPostCodeUnique(post.getPostCode());
        if (StringUtils.isNotNull(info) && info.getPostId() != postId) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 新增岗位
     */
    @Override
    public int insertPost(SysPostSaveReq post) {
        if (StringUtils.isEmpty(post.getStatus())) {
            post.setStatus(UserConstants.NORMAL);
        }
        return postMapper.insertPost(post);
    }

    /**
     * 修改岗位
     */
    @Override
    public int updatePost(SysPostSaveReq post) {
        return postMapper.updatePost(post);
    }

    /**
     * 删除岗位
     */
    @Override
    public int deletePostById(Long postId) {
        return postMapper.deletePostById(postId);
    }
}

