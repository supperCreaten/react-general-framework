import { useDispatch } from "react-redux";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { MessagePlugin } from "tdesign-react";
import type { AppDispatch } from "@/interface";

export const useAppDispatch: () => AppDispatch = useDispatch;

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

export function getParams(data = {}) {
  const params: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (key !== undefined && val != null && val !== "") {
      params[key] = val;
    }
  }
  return params;
}

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

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
