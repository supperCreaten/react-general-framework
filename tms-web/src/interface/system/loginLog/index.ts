/** 登录日志列表行 / 详情 */
export type LoginLogRow = {
  infoId: string | number
  userName?: string
  status?: string | number
  ipaddr?: string
  loginLocation?: string
  browser?: string
  os?: string
  userAgent?: string
  clientType?: string
  msg?: string
  loginTime?: string
}

export type LoginLogDetail = LoginLogRow