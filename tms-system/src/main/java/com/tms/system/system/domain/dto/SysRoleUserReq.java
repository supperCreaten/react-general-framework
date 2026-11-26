package com.tms.system.system.domain.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 角色分配/取消用户
 */
@Data
public class SysRoleUserReq {
    /** 角色ID */
    @NotNull(message = "角色ID不能为空")
    private Long roleId;

    /** 用户ID列表（兼容前端 userList） */
    @NotEmpty(message = "请选择用户")
    @JsonAlias("userList")
    private List<Long> userIds;

    /** 用户ID列表转数组，供批量授权使用 */
    public Long[] toUserIdArray() {
        return userIds == null ? new Long[0] : userIds.toArray(Long[]::new);
    }
}
