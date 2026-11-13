package com.tms.common.utils.encrypt;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 敏感信息加密结果：密文 + 解密密钥 + 脱敏展示值
 *
 * @author tms
 */
@Data
@AllArgsConstructor
public class SensitiveCryptoResult {
    /**
     * 密文（含 IV）
     */
    private String cipherText;

    /**
     * 解密密钥（Base64）
     */
    private String secretKey;

    /**
     * 脱敏后的展示值
     */
    private String maskedText;
}
