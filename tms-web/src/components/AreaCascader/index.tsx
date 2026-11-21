import type { AreaCascaderProps } from "@/interface/components"
import { regionData } from "element-china-area-data"
import { Cascader } from "tdesign-react"

export type { AreaCascaderProps }

/** 省 / 市 / 区县 级联选择，基于 element-china-area-data */
export default function AreaCascader(props: AreaCascaderProps) {
  const {
    options = regionData,
    clearable = true,
    filterable = true,
    valueType = "full",
    showAllLevels = true,
    placeholder = "请选择省市区",
    ...rest
  } = props

  return (
    <Cascader
      {...rest}
      options={options}
      clearable={clearable}
      filterable={filterable}
      valueType={valueType}
      showAllLevels={showAllLevels}
      placeholder={placeholder}
    />
  )
}
