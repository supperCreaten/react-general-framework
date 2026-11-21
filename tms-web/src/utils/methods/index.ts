import { useDispatch } from "react-redux";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { MessagePlugin } from "tdesign-react";
import type { AppDispatch } from "@/interface";

/** 带类型的 Redux dispatch 钩子 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** 统一弹出 TDesign 全局消息 */
export const showMessage = (
  msg: string,
  type: "success" | "error" | "warning" | "info" = "error",
) => {
  const text = msg || "";
  if (!text) return text;
  if (type === "success") MessagePlugin.success(text);
  else if (type === "warning") MessagePlugin.warning(text);
  else if (type === "info") MessagePlugin.info(text);
  else MessagePlugin.error(text);
};

/** 过滤对象中的空值，生成查询参数 */
export function getParams(data = {}) {
  const params: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (key !== undefined && val != null && val !== "") {
      params[key] = val;
    }
  }
  return params;
}

/** 合并 className（clsx 封装） */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** 根据出生日期计算周岁年龄 */
export const getBirthdayToAge = (birthday: string) => {
  const birthdayDate = birthday ?? 0;
  return dayjs().diff(birthdayDate, "year");
};

/** 去空格 */
export function getValueFromTrim(event: { target: { value: string } }) {
  return event.target.value.replace(/\s/g, "");
}

/** @deprecated 使用 getValueFromTrim */
export const getValueFromTtim = getValueFromTrim;
