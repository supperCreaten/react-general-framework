export { createImage, getRadianAngle, cropVisibleRegion, type VisibleCropInput } from "./cropImage";
export { resolvePublicUrl } from "./publicUrl";

export const getBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
