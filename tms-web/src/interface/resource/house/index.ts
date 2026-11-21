/** 房屋列表行 */
export type HouseRow = {
  id: string | number
  houseName?: string
  address?: string
  status?: string | number
  remark?: string
  createTime?: string
  updateTime?: string
  [key: string]: unknown
}

/** 房屋详情 */
export type HouseDetail = HouseRow