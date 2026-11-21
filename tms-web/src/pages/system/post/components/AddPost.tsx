import { useEffect, useMemo, useState } from "react"
import InputText from "@/components/InputText"
import { Form, InputNumber, Radio, TreeSelect, type TreeSelectProps } from "tdesign-react"
import api from "@/api"
import BasicDialog from "@/components/BasicDialog"
import BasicForm from "@/components/BasicForm"
import type { FormConfig } from "@/interface"
import { showMessage } from "@/utils/methods"
import { markLazyChildren } from "@/utils/tree/lazy"
import type { DeptTreeNode } from "@/interface/system/dept"
import type { PostDetail } from "@/interface/system/post"
import type { AddPostProps, PostFormValues } from "@/interface/system/post"

export type { AddPostProps }

const STATUS_OPTIONS = [
  { label: "正常", value: "0" },
  { label: "停用", value: "1" },
]

const initialValues: PostFormValues = {
  postSort: 0,
  status: "0",
  remark: "",
}

/** 将选项值转为字符串，空值用 fallback */
function asOptionValue(value?: string | number, fallback = "0") {
  return value == null || value === "" ? fallback : `${value}`
}

/**
 * 将部门树转为懒加载节点
 * @param list 原始部门节点
 */
function toLazyDeptNodes(list: DeptTreeNode[] = []): DeptTreeNode[] {
  return markLazyChildren(list as Array<Record<string, unknown>>, { idKey: "deptId" }) as DeptTreeNode[]
}

/** 按父节点懒加载子部门 */
async function loadDeptChildren(parentId: string | number) {
  const data = await api.getDepts<DeptTreeNode[]>({ lazy: true, parentId, status: "0" })
  return toLazyDeptNodes(Array.isArray(data) ? data : [])
}

/** 将岗位详情映射为表单初始值 */
function mapDetailToForm(data?: PostDetail): PostFormValues {
  return {
    postName: data?.postName,
    postCode: data?.postCode,
    deptId: data?.deptId != null && data.deptId !== "" ? String(data.deptId) : undefined,
    postSort: data?.postSort ?? 0,
    status: asOptionValue(data?.status, "0"),
    remark: data?.remark ?? "",
  }
}

export default function AddPost(props: AddPostProps) {
  const { visible, title, postId, onClose } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deptTree, setDeptTree] = useState<DeptTreeNode[]>([])
  const isEdit = Boolean(postId) && title.includes("修改")

  const formConfig = useMemo(
    (): FormConfig[] => [
      {
        label: "岗位名称",
        name: "postName",
        colProps: { span: 12 },
        rules: [{ required: true, message: "请输入岗位名称" }],
        component: <InputText clearable placeholder="请输入岗位名称" />,
      },
      {
        label: "岗位编码",
        name: "postCode",
        colProps: { span: 12 },
        rules: [{ required: true, message: "请输入岗位编码" }],
        component: <InputText clearable placeholder="请输入岗位编码" />,
      },
      {
        label: "归属部门",
        name: "deptId",
        colProps: { span: 12 },
        rules: [{ required: true, message: "请选择归属部门" }],
        component: (
          <TreeSelect
            clearable
            filterable
            placeholder="请选择归属部门"
            data={deptTree as unknown as TreeSelectProps["data"]}
            keys={{ label: "deptName", value: "deptId", children: "children" }}
            treeProps={{
              load: async (node) => loadDeptChildren(node.value as string | number),
            }}
          />
        ),
      },
      {
        label: "岗位顺序",
        name: "postSort",
        colProps: { span: 12 },
        rules: [{ required: true, message: "请输入岗位顺序" }],
        component: <InputNumber min={0} theme="normal" className="w-full" placeholder="请输入岗位顺序" />,
      },
      {
        label: "岗位状态",
        name: "status",
        colProps: { span: 12 },
        component: <Radio.Group options={STATUS_OPTIONS} />,
      },
      {
        label: "备注",
        name: "remark",
        colProps: { span: 12 },
        component: <InputText textarea maxlength={200} placeholder="备注" autosize={{ minRows: 3, maxRows: 5 }} />,
      },
    ],
    [deptTree],
  )

  useEffect(() => {
    if (!visible) return
    const init = async () => {
      setLoading(true)
      try {
        form.reset()
        form.setFieldsValue({ ...initialValues })
        setDeptTree(await loadDeptChildren(0))
        if (!isEdit || !postId) return
        const data = await api.getPostDetail<PostDetail>({ postId })
        form.setFieldsValue(mapDetailToForm(data || {}))
      } finally {
        setLoading(false)
      }
    }
    void init()
  }, [visible, postId, isEdit, form])

  /** 校验并提交新增/修改岗位 */
  const handleSubmit = async () => {
    const validate = await form.validate()
    if (validate !== true) return
    setSubmitting(true)
    try {
      const values = form.getFieldsValue(true) as PostFormValues
      const payload: Record<string, unknown> = {
        ...(isEdit && postId ? { postId } : {}),
        postName: values.postName,
        postCode: values.postCode?.trim(),
        deptId: values.deptId,
        postSort: values.postSort ?? 0,
        status: values.status ?? "0",
        remark: values.remark ?? "",
      }
      if (isEdit) {
        await api.updatePost<void>(payload)
      } else {
        await api.insertPost<void>(payload)
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
      width={520}
      confirmLoading={submitting}
      onClose={() => onClose()}
      onConfirm={() => void handleSubmit()}
    >
      <div className={loading ? "pointer-events-none opacity-60" : undefined}>
        <BasicForm form={form} formConfig={formConfig} labelWidth={90} gutter={[16, 0]} reserveErrorSpace />
      </div>
    </BasicDialog>
  )
}
