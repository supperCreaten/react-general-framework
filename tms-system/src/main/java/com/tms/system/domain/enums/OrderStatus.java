package com.tms.system.domain.enums;

/**
 * 订单状态
 *
 * @author tms
 */
public enum OrderStatus {
    /** 待接单 */
    PENDING_ACCEPT("pending_accept", "待接单"),
    /** 待调度 */
    PENDING_DISPATCH("pending_dispatch", "待调度"),
    /** 运输中 */
    IN_TRANSIT("in_transit", "运输中"),
    /** 已签收 */
    SIGNED("signed", "已签收"),
    /** 已完成 */
    COMPLETED("completed", "已完成"),
    /** 已拒绝 */
    REJECTED("rejected", "已拒绝"),
    /** 已取消 */
    CANCELED("canceled", "已取消"),
    /** 异常 */
    EXCEPTION("exception", "异常");

    private final String code;
    private final String info;

    OrderStatus(String code, String info) {
        this.code = code;
        this.info = info;
    }

    public String getCode() {
        return code;
    }

    public String getInfo() {
        return info;
    }

    /**
     * 按状态码解析枚举，未知码返回 null
     */
    public static OrderStatus fromCode(String code) {
        if (code == null || code.isEmpty()) {
            return null;
        }
        for (OrderStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }

    /**
     * 按状态码取中文，未知码返回原值
     */
    public static String getInfoByCode(String code) {
        OrderStatus status = fromCode(code);
        return status != null ? status.info : code;
    }
}
