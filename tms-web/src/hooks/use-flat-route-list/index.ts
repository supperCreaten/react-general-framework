import { useMemo } from "react"
import { useSelector } from "react-redux"
import { buildFlatRouteList } from "@/router/utils/flat-route-list"
import { menuDaTa } from "@/store/modules/menu"

/** 根据菜单树生成扁平路由列表（供标签页、面包屑等使用） */
export function useFlatRouteList() {
  const { wholeMenus } = useSelector(menuDaTa)
  return useMemo(() => buildFlatRouteList(wholeMenus), [wholeMenus])
}
