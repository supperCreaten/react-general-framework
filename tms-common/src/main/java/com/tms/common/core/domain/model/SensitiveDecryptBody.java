package com.tms.common.core.domain.model;

import lombok.Data;

/**
 * 敏感信息解密请求体
 *
 * @author tms
 */
@Data
public class SensitiveDecryptBody
{
    /** 密文（Base64(IV):Base64(ciphertext)） */
    private String cipherText;

    /** 列表下发的解密密钥 */
    private String secretKey;
}
