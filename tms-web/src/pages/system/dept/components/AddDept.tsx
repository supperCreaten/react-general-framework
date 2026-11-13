import { useCallback, useEffect, useMemo, useState } from "react"
import { Form, Input, InputNumber, Radio, TreeSelect, type TreeSelectProps } from "tdesign-react"
import api from "@/api"
import BasicDialog from "@/components/BasicDialog"
import BasicForm from "@/components/BasicForm"
import type { FormConfig } from "@/interface"
import { showMessage } from "@/utils/methods"
import { markLazyChildren } from "@/utils/tree/lazy"

export type DeptTreeNode = {
  deptId: string | number
  deptName: string
  hasChildren?: boolean
  children?: DeptTreeNode[] | boolean
}

type DeptFormValues = {
  parentId?: string | number
  deptName?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
}

type DeptDetail = {
  parentId?: string | number
  deptName?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string | number
}

const STATUS_OPTIONS = [
  { label: "正常", value: "0" },
  { label: "停用", value: "1" },
]

const initialValues: DeptFormValues = {
  parentId: "0",
  orderNum: 0,
  status: "0",
}

function asOptionValue(value?: string | number, fallback = "0") {
  return value == null || value === "" ? fallback : `${value}`
}

function toLazyDeptNodes(list: DeptTreeNode[] = []): DeptTreeNode[] {
  return markLazyChildren(list as Array<Record<string, unknown>>, { idKey: "deptId" }) as DeptTreeNode[]
}

async function loadDeptChildren(parentId: string | number) {
  const data = await api.getDepts({ lazy: true, parentId })
  return toLazyDeptNodes(Array.isArray(data) ? (data as DeptTreeNode[]) : [])
}

function buildParentTreeData(list: DeptTreeNode[] = []): DeptTreeNode[] {
  return [{ deptId: "0", deptName: "主类目", children: list.length ? list : true }]
}

function mapDetailToForm(data?: DeptDetail): DeptFormValues {
  return {
    parentId: data?.parentId != null && data.parentId !== "" ? String(data.parentId) : "0",
    deptName: data?.deptName,
    orderNum: data?.orderNum ?? 0,
    leader: data?.leader || undefined,
    phone: data?.phone || undefined,
    email: data?.email || undefined,
    status: asOptionValue(data?.status, "0"),
  }
}

export type AddDeptProps = {
  visible: boolean
  title: string
  deptId?: string
  parentId?: string
  onClose: (submitted?: boolean) => void
}

export default function AddDept(props: AddDeptProps) {
  const { visible, title, deptId, parentId, onClose } = props
  const [form] = Form.useForm()
  const [treeData, setTreeData] = useState<DeptTreeNode[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isEdit = Boolean(deptId) && title.includes("修改")

  const formConfig = useMemo(
    (): FormConfig[] => [
      {
        label: "上级部门",
        name: "parentId",
        colProps: { span: 12 },
        component: (
          <TreeSelect
            clearable
            filterable
            placeholder="选择上级部门"
            data={treeData as TreeSelectProps["data"]}
            keys={{ label: "deptName", value: "deptId", children: "children" }}
            treeProps={{
              load: async (node) => loadDeptChildren(node.value as string | number),
            }}
            popupProps={{ overlayInnerStyle: { maxHeight: 360 } }}
          />
        ),
      },
      {
        label: "部门名称",
        name: "deptName",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请输入部门名称" }],
        component: <Input clearable placeholder="请输入部门名称" />,
      },
      {
        label: "显示排序",
        name: "orderNum",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请输入显示排序" }],
        component: <InputNumber min={0} theme="normal" placeholder="排序" className="w-full" />,
      },
      {
        label: "负责人",
        name: "leader",
        colProps: { span: 6 },
        component: <Input clearable placeholder="请输入负责人" />,
      },
      {
        label: "联系电话",
        name: "phone",
        colProps: { span: 6 },
        component: <Input clearable placeholder="请输入联系电话" />,
      },
      {
        label: "邮箱",
        name: "email",
        colProps: { span: 6 },
        component: <Input clearable placeholder="请输入邮箱" />,
      },
      {
        label: "部门状态",
        name: "status",
        colProps: { span: 6 },
        component: <Radio.Group options={STATUS_OPTIONS} />,
      },
    ],
    [treeData],
  )

  const loadTreeData = useCallback(async () => {
    try {
      const list = await loadDeptChildren(0)
      setTreeData(buildParentTreeData(list))
    } catch {
      setTreeData(buildParentTreeData())
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const init = async () => {
      setLoading(true)
      try {
        await loadTreeData()
        form.reset()
        form.setFieldsValue({ ...initialValues })
        if (parentId && !isEdit) {
          form.setFieldsValue({ parentId })
        }
        if (!isEdit || !deptId) return
        const data = (await api.getDeptDetail({ deptId })) as DeptDetail
        form.setFieldsValue(mapDetailToForm(data))
      } finally {
        setLoading(false)
      }
    }
    void init()
  }, [visible, deptId, parentId, title, isEdit, form, loadTreeData])

  const handleSubmit = async () => {
    const validate = await form.validate()
    if (validate !== true) return
    setSubmitting(true)
    try {
      const values = form.getFieldsValue(true) as DeptFormValues
      const payload: Record<string, unknown> = {
        ...(isEdit && deptId ? { deptId } : {}),
        parentId: values.parentId ?? "0",
        deptName: values.deptName,
        orderNum: values.orderNum ?? 0,
        leader: values.leader ?? "",
        phone: values.phone ?? "",
        email: values.email ?? "",
        status: values.status ?? "0",
      }
      if (isEdit) {
        await api.updateDept(payload)
      } else {
        await api.insertDept(payload)
      }
      showMessage(`${title}成功`, "success")
      onClose(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BasicDialog
      visible={visible}
      header={title}
      width={720}
      confirmLoading={submitting}
      onClose={() => onClose()}
      onConfirm={() => void handleSubmit()}
    >
      <div className={loading ? "pointer-events-none opacity-60" : undefined}>
        <BasicForm form={form} formConfig={formConfig} labelWidth={90} gutter={[24, 0]} reserveErrorSpace />
      </div>
    </BasicDialog>
  )
}
