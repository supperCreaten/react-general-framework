import { regionData } from "element-china-area-data"
import type { CascaderProps } from "tdesign-react"
import { Cascader } from "tdesign-react"

export type AreaCascaderProps = Omit<CascaderProps, "options"> & {
  /** 自定义选项；默认省市区三级（行政区划编码） */
  options?: CascaderProps["options"]
}

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
