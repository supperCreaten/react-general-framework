package com.tms.system.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tms.common.constant.UserConstants;
import com.tms.common.utils.StringUtils;
import com.tms.system.domain.dto.SysPostQuery;
import com.tms.system.domain.dto.SysPostSaveReq;
import com.tms.system.domain.vo.SysPostVo;
import com.tms.system.mapper.SysPostMapper;
import com.tms.system.service.ISysPostService;

/**
 * 岗位信息 服务实现
 *
 * @author tms
 */
@Service
public class SysPostServiceImpl implements ISysPostService {
    @Autowired
    private SysPostMapper postMapper;

    @Override
    public List<SysPostVo> selectPostList(SysPostQuery query) {
        return postMapper.selectPostList(query == null ? new SysPostQuery() : query);
    }

    @Override
    public SysPostVo selectPostById(Long postId) {
        return postMapper.selectPostById(postId);
    }

    @Override
    public boolean checkPostNameUnique(SysPostSaveReq post) {
        long postId = StringUtils.isNull(post.getPostId()) ? -1L : post.getPostId();
        SysPostVo info = postMapper.checkPostNameUnique(post.getPostName());
        if (StringUtils.isNotNull(info) && info.getPostId() != postId) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    @Override
    public boolean checkPostCodeUnique(SysPostSaveReq post) {
        long postId = StringUtils.isNull(post.getPostId()) ? -1L : post.getPostId();
        SysPostVo info = postMapper.checkPostCodeUnique(post.getPostCode());
        if (StringUtils.isNotNull(info) && info.getPostId() != postId) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    @Override
    public int insertPost(SysPostSaveReq post) {
        if (StringUtils.isEmpty(post.getStatus())) {
            post.setStatus(UserConstants.NORMAL);
        }
        return postMapper.insertPost(post);
    }

    @Override
    public int updatePost(SysPostSaveReq post) {
        return postMapper.updatePost(post);
    }

    @Override
    public int deletePostById(Long postId) {
        return postMapper.deletePostById(postId);
    }
}
