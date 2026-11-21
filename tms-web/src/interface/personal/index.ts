/** 用户档案列表行 */
export type UserProfileRow = {
  id: string | number
  userId?: string | number
  profileName?: string
  status?: string | number
  remark?: string
  createTime?: string
  updateTime?: string
  [key: string]: unknown
}

/** 用户档案详情 */
export type UserProfileDetail = UserProfileRow

/** 个人中心：基本资料表单 */
export type ProfileFormValues = {
  nickName: string
  phonenumber: string
  email: string
  sex: string
}

/** 个人中心：修改密码表单 */
export type PasswordFormValues = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

/** 个人中心页面 UI 状态 */
export type ProfileUiState = {
  activeTab: string
  savingProfile: boolean
  savingPassword: boolean
  uploadingAvatar: boolean
}

/** 头像上传成功返回（若依 AjaxResult 上的 imgUrl） */
export type AvatarUploadResult = {
  imgUrl?: string
}