import { useCallback, useEffect, useMemo, useState } from "react"
import { Form, InputNumber, Radio, Select, TreeSelect, type TreeSelectProps } from "tdesign-react"
import api from "@/api"
import BasicDialog from "@/components/BasicDialog"
import BasicForm from "@/components/BasicForm"
import { createIconList } from "@/icons"
import type { FormConfig } from "@/interface"
import { showMessage } from "@/utils/methods"
import { markLazyChildren } from "@/utils/tree/lazy"
import {
  FRAME_OPTIONS,
  KEEP_ALIVE_OPTIONS,
  MENU_TYPE_OPTIONS,
  STATUS_OPTIONS,
  VISIBLE_OPTIONS,
  isCacheToKeepAlive,
  keepAliveToIsCache,
  shouldShowFrameFields,
  shouldShowIcon,
  shouldShowMenuDetailFields,
  shouldShowRouteFields,
} from "../constants"
import { MENU_TYPE } from "@/constants/menu"
import InputText from "@/components/InputText"

export type MenuTreeNode = {
  menuId: string | number
  menuName: string
  hasChildren?: boolean
  children?: MenuTreeNode[] | boolean
}

const SELECT_SCROLL = { type: "virtual" as const }

type MenuFormValues = {
  parentId?: string | number
  menuType?: number
  icon?: string
  menuName?: string
  orderNum?: number
  isFrame?: string
  path?: string
  perms?: string
  keepAlive?: string
  hidden?: string
  status?: string
}

type MenuDetail = {
  parentId?: string | number
  menuType?: number
  icon?: string
  menuName?: string
  orderNum?: number
  path?: string
  perms?: string
  isFrame?: string | number
  visible?: string | number
  hidden?: string | number
  status?: string | number
  isCache?: string | number
  keepAlive?: string | number
}

const ICON_OPTIONS = createIconList().map((item) => ({
  label: item.label,
  value: item.value,
}))

const initialValues: MenuFormValues = {
  menuType: MENU_TYPE.DIRECTORY,
  isFrame: "1",
  hidden: "0",
  keepAlive: "1",
  status: "0",
  orderNum: 0,
}

/** 将选项值转为字符串，空值用 fallback */
function asOptionValue(value?: string | number, fallback = "0") {
  return value == null || value === "" ? fallback : `${value}`
}

/**
 * 将菜单树转为懒加载节点
 * @param list 原始菜单节点
 */
function toLazyMenuNodes(list: MenuTreeNode[] = []): MenuTreeNode[] {
  return markLazyChildren(list as Array<Record<string, unknown>>, { idKey: "menuId" }) as MenuTreeNode[]
}

/** 按父节点懒加载子菜单 */
async function loadMenuChildren(parentId: string | number) {
  const data = await api.getMenus<MenuTreeNode[]>({ lazy: true, parentId })
  return toLazyMenuNodes(Array.isArray(data) ? data : [])
}

/** 在菜单树根上插入「主类目」节点 */
function buildParentTreeData(list: MenuTreeNode[] = []): MenuTreeNode[] {
  return [{ menuId: "0", menuName: "主类目", children: list.length ? list : true }]
}

/** 将菜单详情映射为表单初始值 */
function mapDetailToForm(data?: MenuDetail): MenuFormValues {
  return {
    parentId: data?.parentId != null && data.parentId !== "" ? data.parentId : "0",
    menuType: data?.menuType ?? MENU_TYPE.DIRECTORY,
    icon: data?.icon || undefined,
    menuName: data?.menuName,
    orderNum: data?.orderNum ?? 0,
    path: data?.path || undefined,
    perms: data?.perms || undefined,
    isFrame: asOptionValue(data?.isFrame, "1"),
    hidden: asOptionValue(data?.visible ?? data?.hidden, "0"),
    status: asOptionValue(data?.status, "0"),
    keepAlive: isCacheToKeepAlive(data?.isCache ?? data?.keepAlive),
  }
}

/** 按菜单类型组装提交给后端的 payload */
function buildSubmitPayload(values?: MenuFormValues, menuId?: string) {
  const menuType = values?.menuType ?? MENU_TYPE.DIRECTORY
  const isMenuLike = menuType === MENU_TYPE.MENU || menuType === MENU_TYPE.PAGE
  const isButton = menuType === MENU_TYPE.BUTTON
  const keepAlive = isMenuLike ? (values?.keepAlive ?? "1") : "0"

  return {
    ...(menuId ? { menuId } : {}),
    menuName: values?.menuName,
    menuType,
    parentId: values?.parentId ?? "0",
    icon: values?.icon,
    perms: values?.perms,
    orderNum: values?.orderNum ?? 0,
    status: values?.status ?? "0",
    visible: values?.hidden ?? "0",
    isCache: keepAliveToIsCache(keepAlive),
    isFrame: values?.isFrame ?? "1",
    ...(!isButton ? { path: values?.path ?? "" } : {}),
  }
}

export type AddMenuProps = {
  visible: boolean
  title: string
  menuId?: string
  onClose: (submitted?: boolean) => void
}

export default function AddMenu(props: AddMenuProps) {
  const { visible, title, menuId, onClose } = props
  const [form] = Form.useForm()
  const menuType = (Form.useWatch("menuType", form) as number | undefined) ?? MENU_TYPE.DIRECTORY
  const [treeData, setTreeData] = useState<MenuTreeNode[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isEdit = title === "修改菜单"

  const formConfig = useMemo((): FormConfig[] => {
    const fields: FormConfig[] = [
      {
        label: "上级菜单",
        name: "parentId",
        colProps: { span: 12 },
        rules: [{ required: true, message: "请选择上级菜单" }],
        component: (
          <TreeSelect
            clearable
            filterable
            placeholder="请选择上级菜单"
            data={treeData as TreeSelectProps["data"]}
            keys={{ label: "menuName", value: "menuId", children: "children" }}
            treeProps={{
              load: async (node) => loadMenuChildren(node.value as string | number),
            }}
            popupProps={{ overlayInnerStyle: { maxHeight: 360 } }}
          />
        ),
      },
      {
        label: "菜单类型",
        name: "menuType",
        colProps: { span: 12 },
        component: <Radio.Group options={MENU_TYPE_OPTIONS} />,
      },
    ]

    if (shouldShowIcon(menuType)) {
      fields.push({
        label: "菜单图标",
        name: "icon",
        colProps: { span: 12 },
        rules: menuType === MENU_TYPE.DIRECTORY ? [{ required: true, message: "请选择菜单图标" }] : undefined,
        component: (
          <Select
            clearable
            filterable
            placeholder="请选择图标"
            options={ICON_OPTIONS}
            scroll={SELECT_SCROLL}
            popupProps={{ overlayInnerStyle: { maxHeight: 280 } }}
          />
        ),
      })
    }

    fields.push({
      label: "菜单名称",
      name: "menuName",
      colProps: { span: 6 },
      rules: [{ required: true, message: "请输入菜单名称" }],
      component: <InputText clearable placeholder="请输入菜单名称" />,
    })

    if (menuType !== MENU_TYPE.PAGE) {
      fields.push({
        label: "显示排序",
        name: "orderNum",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请输入显示排序" }],
        component: <InputNumber min={0} theme="normal" placeholder="排序" className="w-full" />,
      })
    }

    if (shouldShowFrameFields(menuType)) {
      fields.push({
        label: "是否外链",
        name: "isFrame",
        colProps: { span: 6 },
        component: <Radio.Group options={FRAME_OPTIONS} />,
      })
    }

    if (shouldShowRouteFields(menuType)) {
      fields.push({
        label: "路由地址",
        name: "path",
        colProps: { span: 6 },
        rules: [{ required: true, message: "请输入路由地址" }],
        component: <InputText clearable placeholder="如 user；外链填完整 URL" />,
      })
    }

    if (menuType !== MENU_TYPE.PAGE) {
      fields.push({
        label: "权限字符",
        name: "perms",
        colProps: { span: shouldShowRouteFields(menuType) ? 6 : 12 },
        rules: menuType === MENU_TYPE.BUTTON ? [{ required: true, message: "请输入权限标识" }] : undefined,
        component: <InputText clearable placeholder="如 system:user:list" />,
      })
    }

    if (shouldShowMenuDetailFields(menuType)) {
      fields.push({
        label: "是否缓存",
        name: "keepAlive",
        colProps: { span: 6 },
        component: <Radio.Group options={KEEP_ALIVE_OPTIONS} />,
      })
    }

    if (menuType !== MENU_TYPE.BUTTON) {
      fields.push({
        label: "显示状态",
        name: "hidden",
        colProps: { span: 6 },
        component: <Radio.Group options={VISIBLE_OPTIONS} />,
      })
    }

    fields.push({
      label: "菜单状态",
      name: "status",
      colProps: { span: menuType === MENU_TYPE.BUTTON ? 12 : 6 },
      component: <Radio.Group options={STATUS_OPTIONS} />,
    })

    return fields
  }, [menuType, treeData])

  const loadTreeData = useCallback(async () => {
    try {
      const list = await loadMenuChildren(0)
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
        if (menuId && title === "新增菜单") {
          form.setFieldsValue({ parentId: menuId })
        }
        if (!isEdit || !menuId) return
        const data = await api.getMenuDetail<MenuDetail>({ menuId })
        form.setFieldsValue(mapDetailToForm(data || {}))
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [visible, menuId, title, isEdit, form, loadTreeData])

  /** 校验并提交新增/修改菜单 */
  const handleSubmit = async () => {
    const validate = await form.validate()
    if (validate !== true) return
    setSubmitting(true)
    try {
      const values = form.getFieldsValue(true) as MenuFormValues
      const payload = buildSubmitPayload(values, isEdit ? menuId : undefined)
      if (isEdit) {
        await api.updateMenu(payload)
      } else {
        await api.insertMenu(payload)
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
      width={760}
      confirmLoading={submitting}
      onClose={() => onClose()}
      onConfirm={() => void handleSubmit()}
    >
      <div className={loading ? "pointer-events-none opacity-60" : undefined}>
        <BasicForm
          form={form}
          initialData={initialValues}
          formConfig={formConfig}
          labelWidth={100}
          gutter={[24, 0]}
          reserveErrorSpace
          statusIcon={false}
        />
      </div>
    </BasicDialog>
  )
}
