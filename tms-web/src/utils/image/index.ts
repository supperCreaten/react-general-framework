export { createImage, getRadianAngle, cropVisibleRegion, type VisibleCropInput } from "./cropImage";
export { resolvePublicUrl } from "./publicUrl";

/** 将 Blob 转为 Data URL 的 Base64 字符串 */
export const getBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
