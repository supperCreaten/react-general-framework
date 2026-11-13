/** 将后端 hasChildren 标记转为 TDesign 树/树表可识别的 children: true */
export function markLazyChildren<T extends Record<string, unknown>>(
  list: T[] = [],
  options: {
    idKey: string
    hasChildrenKey?: string
    childrenKey?: string
  },
): T[] {
  const { idKey, hasChildrenKey = "hasChildren", childrenKey = "children" } = options
  return list.map((item) => {
    const id = item[idKey]
    const nested = item[childrenKey]
    const hasChildren = Boolean(item[hasChildrenKey])
    const next: Record<string, unknown> = {
      ...item,
      [idKey]: id == null ? id : String(id),
    }
    if (Array.isArray(nested) && nested.length) {
      next[childrenKey] = markLazyChildren(nested as T[], options)
    } else if (hasChildren) {
      next[childrenKey] = true
    } else {
      delete next[childrenKey]
    }
    delete next[hasChildrenKey]
    return next as T
  })
}
