/** 部门树节点（懒加载 / 下拉树） */
export type DeptTreeNode = {
  deptId: string | number
  deptName: string
  hasChildren?: boolean
  children?: DeptTreeNode[] | boolean
}

/** 部门详情 */
export type DeptDetail = {
  parentId?: string | number
  deptName?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string | number
}

/** 部门列表/树表行 */
export type DeptRow = {
  deptId: string | number
  parentId?: string | number
  deptName: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string | number
  createBy?: string
  createTime?: string
  hasChildren?: boolean
  /** 懒加载未展开时用 true 占位（运行时）；类型上兼容 TableRowData */
  children?: DeptRow[] | boolean
}

/** 部门表单值 */
export type DeptFormValues = {
  parentId?: string | number
  deptName?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
}

/** 新增/编辑部门弹窗 Props */
export type AddDeptProps = {
  visible: boolean
  title: string
  deptId?: string
  parentId?: string
  onClose: (submitted?: boolean) => void
}

/** 部门列表页弹窗状态 */
export type DeptDialogState = {
  visible: boolean
  title: string
  deptId?: string
  parentId?: string
}