import NP from "number-precision";
import { trimTrailingZeros } from "./decimal";

/** NP 入参类型；仅做类型断言，不改运行时值 */
type NpInput = string | number;
function asNpInput(value: unknown): NpInput {
  return value as NpInput;
}

/** 金额保留 4 位小数，末尾连续 0 简化 */
function formatAmount(value: number) {
  return trimTrailingZeros(NP.round(value, 4).toFixed(4));
}

/** 单价 / 数量保留 2 位小数，末尾连续 0 简化 */
function formatPrice(value: number) {
  return trimTrailingZeros(NP.round(value, 2).toFixed(2));
}

/**
 * 判断计价入参是否为空。
 * null / undefined / "" / 未写完的小数（如 12.）/ NaN 视为空；税率 "0" 合法。
 */
function isEmpty(value: unknown): boolean {
  if (value == null || value === "") return true;
  const str = String(value);
  if (str.endsWith(".")) return true;
  return Number.isNaN(Number(str));
}

export type TaxPriceCalcResult = {
  /** 含税金额（4 位） */
  taxInclusiveAmount: string;
  /** 不含税金额（4 位） */
  taxExclusiveAmount: string;
  /** 不含税单价（2 位） */
  taxExclusiveUnitPrice: string;
  /** 税额（4 位） */
  taxAmount: string;
};

const EMPTY_RESULT: TaxPriceCalcResult = {
  taxInclusiveAmount: "",
  taxExclusiveAmount: "",
  taxExclusiveUnitPrice: "",
  taxAmount: "",
};

/**
 * 含税金额 = 含税单价 × 数量（保留 4 位）
 * 含税单价或数量为空 → ""
 */
export function calcTaxInclusiveAmount(taxInclusiveUnitPrice: unknown, quantity: unknown) {
  if (isEmpty(taxInclusiveUnitPrice) || isEmpty(quantity)) return "";
  return formatAmount(NP.times(asNpInput(taxInclusiveUnitPrice), asNpInput(quantity)));
}

/**
 * 不含税金额 = 含税金额 / (1 + 税率)（保留 4 位）
 * @param taxRate 税率(%)，如 13 表示 13%；0 合法
 * 含税金额或税率为空 → ""
 */
export function calcTaxExclusiveAmount(taxInclusiveAmount: unknown, taxRate: unknown) {
  if (isEmpty(taxInclusiveAmount) || isEmpty(taxRate)) return "";
  const rate = NP.divide(asNpInput(taxRate), 100);
  return formatAmount(NP.divide(asNpInput(taxInclusiveAmount), NP.plus(1, rate)));
}

/**
 * 不含税单价 = 不含税金额 / 数量（保留 2 位）
 * 不含税金额或数量为空 → ""
 */
export function calcTaxExclusiveUnitPrice(taxExclusiveAmount: unknown, quantity: unknown) {
  if (isEmpty(taxExclusiveAmount) || isEmpty(quantity)) return "";
  return formatPrice(NP.divide(asNpInput(taxExclusiveAmount), asNpInput(quantity)));
}

/**
 * 税额 = 含税金额 - 不含税金额（保留 4 位）
 * 含税金额或不含税金额为空 → ""
 */
export function calcTaxAmount(taxInclusiveAmount: unknown, taxExclusiveAmount: unknown) {
  if (isEmpty(taxInclusiveAmount) || isEmpty(taxExclusiveAmount)) return "";
  return formatAmount(NP.minus(asNpInput(taxInclusiveAmount), asNpInput(taxExclusiveAmount)));
}

/**
 * 按公式推导明细计价字段：
 * 1. 含税单价 × 数量 = 含税金额
 * 2. 含税金额 / (1 + 税率) = 不含税金额
 * 3. 不含税金额 / 数量 = 不含税单价
 * 4. 含税金额 - 不含税金额 = 税额
 *
 * - 数量或含税单价为空 → 四个结果全部为 ""
 * - 仅缺税率 → 只出含税金额，其余为 ""
 * - 三者齐全 → 四个结果全部算出
 */
export function calcTaxInclusivePriceFields(
  taxInclusiveUnitPrice: unknown,
  quantity: unknown,
  taxRate: unknown,
): TaxPriceCalcResult {
  if (isEmpty(taxInclusiveUnitPrice) || isEmpty(quantity)) {
    return { ...EMPTY_RESULT };
  }

  const taxInclusiveAmount = calcTaxInclusiveAmount(taxInclusiveUnitPrice, quantity);
  if (isEmpty(taxInclusiveAmount)) {
    return { ...EMPTY_RESULT };
  }

  if (isEmpty(taxRate)) {
    return {
      taxInclusiveAmount,
      taxExclusiveAmount: "",
      taxExclusiveUnitPrice: "",
      taxAmount: "",
    };
  }

  const taxExclusiveAmount = calcTaxExclusiveAmount(taxInclusiveAmount, taxRate);
  const taxExclusiveUnitPrice = calcTaxExclusiveUnitPrice(taxExclusiveAmount, quantity);
  const taxAmount = calcTaxAmount(taxInclusiveAmount, taxExclusiveAmount);

  if (isEmpty(taxExclusiveAmount) || isEmpty(taxExclusiveUnitPrice) || isEmpty(taxAmount)) {
    return {
      taxInclusiveAmount,
      taxExclusiveAmount: "",
      taxExclusiveUnitPrice: "",
      taxAmount: "",
    };
  }

  return {
    taxInclusiveAmount,
    taxExclusiveAmount,
    taxExclusiveUnitPrice,
    taxAmount,
  };
}
