import { useEffect, useMemo, useState } from "react"
import api from "@/api"
import type { DictItem, DictOption } from "@/interface/resource/dict"

export type { DictOption }

type DictRecord = Record<string, DictOption[]>

/** 进程内缓存，避免同一字典编码重复请求 */
const dictCache: DictRecord = {}

function normalizeDictList(response: DictItem[] | unknown): DictOption[] {
  if (!Array.isArray(response)) return []
  return response.map((item: DictItem) => ({
    label: item?.dictLabel ?? "",
    value: item?.dictValue ?? "",
    id: String(item?.id ?? item?.dictId ?? ""),
  }))
}

function buildInitialDict(codes: string[]): DictRecord {
  return codes.reduce<DictRecord>((acc, code) => {
    if (dictCache[code]) {
      acc[code] = dictCache[code]
    }
    return acc
  }, {})
}

/** 按字典选项把 value 转成 label；找不到则回退原值 */
export function getDictLabel(options: DictOption[] | undefined, value?: string | null, fallback = "-") {
  if (value == null || value === "") return fallback
  return options?.find((item) => item.value === value)?.label ?? value
}

/**
 * 按字典编码批量加载选项，返回形如 { sys_document_type: [...] } 的对象，可直接解构使用。
 */
export default function useDict(codes: string[]) {
  // 用极少出现的分隔符拼接，避免 dictCode 含逗号时被拆错；仅作依赖稳定化，结果与原先 Set 去重一致
  const codesKey = [...new Set(codes.filter(Boolean))].join("\u0001")
  const stableCodes = useMemo(
    () => (codesKey === "" ? [] : codesKey.split("\u0001")),
    [codesKey],
  )

  const [dict, setDict] = useState<DictRecord>(() => buildInitialDict(stableCodes))

  useEffect(() => {
    if (!stableCodes.length) {
      setDict({})
      return
    }

    let cancelled = false

    const fetchDict = async () => {
      // allSettled：单个字典失败不影响其它已成功的结果
      const results = await Promise.allSettled(
        stableCodes.map(async (code) => {
          if (dictCache[code]) {
            return [code, dictCache[code]] as const
          }
          const response = await api.getDictByCode<DictItem[]>({ dictCode: code })
          const options = normalizeDictList(response)
          dictCache[code] = options
          return [code, options] as const
        }),
      )

      if (cancelled) return

      const entries = results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value
        }
        return [stableCodes[index], []] as const
      })

      setDict((prev) => ({
        ...prev,
        ...Object.fromEntries(entries),
      }))
    }

    fetchDict()

    return () => {
      cancelled = true
    }
  }, [codesKey, stableCodes])

  return dict
}
