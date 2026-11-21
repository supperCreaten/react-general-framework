/** 字典项（allDict / 字典数据） */
export type DictItem = {
  dictLabel?: string
  dictValue?: string
  id?: string | number
  dictId?: string | number
  status?: string | number
}

/** 字典下拉选项（规范化后，供表单 / 表格展示） */
export type DictOption = {
  label: string
  value: string
  id: string
}

/** 字典主表列表行 */
export type DictRow = {
  dictId: string | number
  dictName?: string
  dictCode?: string
  status?: string | number
  remark?: string
  createTime?: string
  updateTime?: string
  items?: DictItem[]
}

/** 字典详情 */
export type DictDetail = DictRow