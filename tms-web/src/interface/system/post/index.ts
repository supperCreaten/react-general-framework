/** 岗位列表行 */
export type PostRow = {
  postId: string | number
  postCode: string
  postName: string
  postSort?: number
  status?: string | number
  createTime?: string
  remark?: string
}

/** 岗位详情 */
export type PostDetail = {
  postName?: string
  postCode?: string
  deptId?: string | number
  postSort?: number
  status?: string | number
  remark?: string
}

/** 岗位下拉选项行 */
export type PostOption = {
  postId: string | number
  postName: string
}

/** 岗位表单值 */
export type PostFormValues = {
  postName?: string
  postCode?: string
  deptId?: string
  postSort?: number
  status?: string
  remark?: string
}

/** 新增/编辑岗位弹窗 Props */
export type AddPostProps = {
  visible: boolean
  title: string
  postId?: string
  onClose: (submitted?: boolean) => void
}

/** 岗位列表页弹窗状态 */
export type PostDialogState = {
  visible: boolean
  title: string
  postId?: string
}