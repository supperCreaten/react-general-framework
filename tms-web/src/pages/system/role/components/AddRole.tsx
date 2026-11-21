import { useCallback, useEffect, useMemo, useReducer } from "react"
import { Card, Col, Form, InputNumber, Loading, Row, Switch, Tree } from "tdesign-react"
import api from "@/api"
import BasicDialog from "@/components/BasicDialog"
import BasicForm from "@/components/BasicForm"
import type { FormConfig } from "@/interface"
import { showMessage } from "@/utils/methods"
import InputText from "@/components/InputText"

type MenuTreeNode = {
  menuId: string | number
  menuName: string
  children?: MenuTreeNode[]
}

export type AddRoleProps = {
  visible: boolean
  title: string
  roleId?: string
  onClose: (submitted?: boolean) => void
}

function toMenuIds(keys: Array<string | number>): string[] {
  return keys.map((k) => String(k)).filter(Boolean)
}

type AddRoleState = {
  treeData: MenuTreeNode[]
  selectedMenuKeys: Array<string | number>
  treeLoading: boolean
  loading: boolean
  submitting: boolean
}

const initialAddRoleState: AddRoleState = {
  treeData: [],
  selectedMenuKeys: [],
  treeLoading: false,
  loading: false,
  submitting: false,
}

function addRoleReducer(state: AddRoleState, patch: Partial<AddRoleState>): AddRoleState {
  return { ...state, ...patch }
}

export default function AddRole(props: AddRoleProps) {
  const { visible, title, roleId, onClose } = props
  const [form] = Form.useForm()
  const [state, dispatch] = useReducer(addRoleReducer, initialAddRoleState)
  const { treeData, selectedMenuKeys, treeLoading, loading, submitting } = state
  const isEdit = title === "修改角色"

  const formConfig = useMemo(
    (): FormConfig[] => [
      {
        label: "角色编码",
        name: "roleCode",
        colProps: { span: 12 },
        component: (
          <InputText disabled placeholder={isEdit ? "角色编码" : "保存后自动生成数字编号"} />
        ),
      },
      {
        label: "权限字符",
        name: "roleKey",
        colProps: { span: 12 },
        rules: [{ required: true, message: "请输入权限字符" }],
        component: <InputText clearable placeholder="如 admin、dispatcher" />,
      },
      {
        label: "角色名称",
        name: "roleName",
        colProps: { span: 12 },
        rules: [{ required: true, message: "请输入角色名称" }],
        component: <InputText clearable placeholder="请输入角色名称" />,
      },
      {
        label: "排序",
        name: "roleSort",
        colProps: { span: 12 },
        component: <InputNumber min={0} theme="normal" className="w-full" placeholder="请输入排序" />,
      },
      {
        label: "状态",
        name: "status",
        colProps: { span: 12 },
        component: <Switch label={["启用", "停用"]} />,
      },
      {
        label: "备注",
        name: "remark",
        colProps: { span: 12 },
        component: <InputText clearable maxlength={500} placeholder="请输入备注" />,
      },
    ],
    [isEdit],
  )

  const loadMenuTree = useCallback(async () => {
    dispatch({ treeLoading: true })
    try {
      const res = await api.getMenus()
      dispatch({ treeData: Array.isArray(res) ? (res as MenuTreeNode[]) : [] })
    } finally {
      dispatch({ treeLoading: false })
    }
  }, [])

  const loadMenuConfig = useCallback(async () => {
    if (!roleId) return
    try {
      const res = (await api.getMenuConfig({ roleId })) as {
        checkedKeys?: Array<string | number>
      }
      dispatch({ selectedMenuKeys: (res?.checkedKeys ?? []).map((id) => String(id)) })
    } catch {
      dispatch({ selectedMenuKeys: [] })
    }
  }, [roleId])

  useEffect(() => {
    if (!visible) return
    const init = async () => {
      dispatch({ loading: true })
      try {
        await loadMenuTree()
        form.reset()
        form.setFieldsValue({ status: true, roleSort: 0 })
        if (!isEdit || !roleId) return
        const data = (await api.getRoleDetail({ roleId })) as Record<string, unknown>
        form.setFieldsValue({
          roleCode: data.roleCode,
          roleKey: data.roleKey,
          roleName: data.roleName,
          status: data.status === 0 || data.status === "0",
          roleSort: data.roleSort ?? data.orderNum ?? 0,
          remark: data.remark,
        })
        await loadMenuConfig()
      } finally {
        dispatch({ loading: false })
      }
    }
    void init()
  }, [visible, roleId, isEdit, form, loadMenuTree, loadMenuConfig])

  const handleSubmit = async () => {
    const validate = await form.validate()
    if (validate !== true) return
    if (!selectedMenuKeys.length) {
      showMessage("请选择菜单权限", "warning")
      return
    }
    dispatch({ submitting: true })
    try {
      const values = form.getFieldsValue(true) as {
        roleCode?: string
        roleKey?: string
        roleName?: string
        status?: boolean
        roleSort?: number
        remark?: string
      }
      const params: Record<string, unknown> = {
        roleName: values.roleName,
        roleKey: values.roleKey?.trim(),
        status: values.status ? "0" : "1",
        roleSort: values.roleSort ?? 0,
        remark: values.remark ?? "",
        menuIds: toMenuIds(selectedMenuKeys),
      }
      if (isEdit) {
        // 编辑不改角色编码，权限字符随表单提交
        await api.updateRole({ ...params, roleId })
      } else {
        // 新增不传 roleCode，由后端自动生成数字编号
        await api.insertRole(params)
      }
      showMessage(`${title}成功`, "success")
      onClose(true)
    } finally {
      dispatch({ submitting: false })
    }
  }

  return (
    <BasicDialog
      visible={visible}
      header={title}
      width={980}
      confirmLoading={submitting}
      onClose={() => onClose()}
      onConfirm={() => void handleSubmit()}
    >
      <Loading loading={loading} showOverlay>
        <Row gutter={16}>
          <Col span={5}>
            <Card title="基本信息" bordered className="h-full">
              <BasicForm form={form} formConfig={formConfig} labelWidth={80} labelAlign="right" />
            </Card>
          </Col>
          <Col span={7}>
            <Card title="菜单权限" bordered className="h-full">
              <Loading loading={treeLoading}>
                <div className="h-80 overflow-auto rounded border border-(--td-component-border) bg-(--td-bg-color-container) p-2">
                  <Tree
                    data={treeData}
                    checkable
                    expandAll
                    value={selectedMenuKeys}
                    keys={{ label: "menuName", value: "menuId", children: "children" }}
                    valueMode="all"
                    onChange={(value) => dispatch({ selectedMenuKeys: value as Array<string | number> })}
                  />
                </div>
              </Loading>
            </Card>
          </Col>
        </Row>
      </Loading>
    </BasicDialog>
  )
}
