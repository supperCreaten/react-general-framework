/** 操作日志列表行 / 详情 */
export type OperLogRow = {
  operId: string | number
  title?: string
  businessType?: number
  method?: string
  requestMethod?: string
  operatorType?: number
  operName?: string
  deptName?: string
  operUrl?: string
  operIp?: string
  operLocation?: string
  operParam?: string
  jsonResult?: string
  changeDiff?: string
  status?: number
  errorMsg?: string
  operTime?: string
  costTime?: number
  userAgent?: string
}

export type OperLogDetail = OperLogRow