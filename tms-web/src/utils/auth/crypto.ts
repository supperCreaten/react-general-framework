import crypto from "crypto-js";

/** AES 加密（登录账号/密码等） */
export function aesEncrypt(str: string) {
  if (!str) return;
  const key = crypto.enc.Utf8.parse("mm7h3ck87ugk9l4a"); // 128位密钥
  const iv = crypto.enc.Utf8.parse("jxkvxz97409u3m8c"); // 初始化向量
  const encrypted = crypto.AES.encrypt(str, key, {
    iv: iv,
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7,
  });
  return encrypted.toString();
}
