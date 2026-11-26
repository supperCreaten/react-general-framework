package com.tms.system.system.mapper;

import java.util.List;
import com.tms.system.system.domain.dto.SysPostQuery;
import com.tms.system.system.domain.dto.SysPostSaveReq;
import com.tms.system.system.domain.vo.SysPostVo;

/**
 * 岗位信息 数据层
 *
 * @author tms
 */
public interface SysPostMapper {
    /**
     * 查询岗位数据集合
     *
     * @param query 岗位查询条件
     * @return 岗位数据集合
     */
    List<SysPostVo> selectPostList(SysPostQuery query);

    /**
     * 通过岗位ID查询岗位信息
     *
     * @param postId 岗位ID
     * @return 岗位信息
     */
    SysPostVo selectPostById(Long postId);

    /**
     * 校验岗位名称
     *
     * @param postName 岗位名称
     * @return 结果
     */
    SysPostVo checkPostNameUnique(String postName);

    /**
     * 校验岗位编码
     *
     * @param postCode 岗位编码
     * @return 结果
     */
    SysPostVo checkPostCodeUnique(String postCode);

    /**
     * 新增岗位信息
     *
     * @param post 岗位信息
     * @return 结果
     */
    int insertPost(SysPostSaveReq post);

    /**
     * 修改岗位信息
     *
     * @param post 岗位信息
     * @return 结果
     */
    int updatePost(SysPostSaveReq post);

    /**
     * 删除岗位信息
     *
     * @param postId 岗位ID
     * @return 结果
     */
    int deletePostById(Long postId);
}
