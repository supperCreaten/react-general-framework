import { useMemo, useRef, useState } from "react"
import { Button, DialogPlugin, Select, Tag, type TableProps } from "tdesign-react"
import { AddIcon } from "tdesign-icons-react"
import api from "@/api"
import BasicTable, { type BasicTableRef } from "@/components/BasicTable"
import MoreActions from "@/components/MoreActions"
import SearchBox, { type SearchBoxRef } from "@/components/SearchBox"
import TableSection from "@/components/TableSection"
import type { FormConfig } from "@/interface"
import { getParams, showMessage } from "@/utils/methods"
import { markLazyChildren } from "@/utils/tree/lazy"
import InputText from "@/components/InputText"
import AddDept from "./components/AddDept"

type DeptRow = {
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
  children?: DeptRow[]
}

type DeptDialogState = {
  visible: boolean
  title: string
  deptId?: string
  parentId?: string
}

/** 完整树（搜索场景） */
function normalizeDeptTree(list: DeptRow[] = []): DeptRow[] {
  return list.map((item) => {
    const children = Array.isArray(item.children) && item.children.length ? normalizeDeptTree(item.children) : undefined
    return {
      ...item,
      deptId: String(item.deptId),
      parentId: item.parentId != null ? String(item.parentId) : undefined,
      children,
    }
  })
}

/** 懒加载节点：有子级时 children=true（运行时标记） */
function toLazyDeptRows(list: DeptRow[] = []): DeptRow[] {
  return markLazyChildren(list as Array<Record<string, unknown>>, { idKey: "deptId" }) as unknown as DeptRow[]
}

export default function DeptPage() {
  const searchRef = useRef<SearchBoxRef>(null)
  const tableRef = useRef<BasicTableRef<DeptRow>>(null)
  const loadingChildrenRef = useRef<Set<string>>(new Set())
  const [dialog, setDialog] = useState<DeptDialogState>({ visible: false, title: "" })

  const formConfig = useMemo<FormConfig[]>(
    () => [
      {
        label: "部门名称",
        name: "deptName",
        component: <InputText clearable placeholder="请输入部门名称" />,
      },
      {
        label: "状态",
        name: "status",
        component: (
          <Select
            clearable
            placeholder="部门状态"
            options={[
              { label: "正常", value: "0" },
              { label: "停用", value: "1" },
            ]}
          />
        ),
      },
    ],
    [],
  )

  const columns = useMemo<TableProps<DeptRow>["columns"]>(
    () => [
      {
        title: "部门名称",
        colKey: "deptName",
        minWidth: 220,
        ellipsis: true,
      },
      {
        title: "排序",
        colKey: "orderNum",
        width: 80,
        align: "center",
      },
      {
        title: "状态",
        colKey: "status",
        width: 88,
        align: "center",
        cell: ({ row }) =>
          String(row.status) === "0" ? (
            <Tag theme="primary" variant="light">
              正常
            </Tag>
          ) : (
            <Tag variant="light">停用</Tag>
          ),
      },
      { title: "创建时间", colKey: "createTime", align: "center", minWidth: 170, ellipsis: true },
      {
        title: "操作",
        colKey: "operation",
        width: 180,
        align: "center",
        fixed: "right",
        cell: ({ row }) => (
          <MoreActions
            items={[
              {
                key: "edit",
                label: "修改",
                onClick: () =>
                  setDialog({ visible: true, title: "修改部门", deptId: String(row.deptId) }),
              },
              {
                key: "add",
                label: "新增",
                onClick: () =>
                  setDialog({
                    visible: true,
                    title: "添加部门",
                    parentId: String(row.deptId),
                  }),
              },
              {
                key: "delete",
                label: "删除",
                theme: "danger",
                onClick: () => handleDelete(row),
              },
            ]}
          />
        ),
      },
    ],
    [],
  )

  const handleSearch = () => {
    loadingChildrenRef.current.clear()
    void tableRef.current?.refresh({ resetCurrent: true })
  }

  const handleDelete = (row: DeptRow) => {
    const dialogInstance = DialogPlugin.confirm({
      header: "提示",
      body: `是否确认删除名称为「${row.deptName}」的数据项？`,
      onConfirm: async () => {
        try {
          await api.deleteDept({ deptId: row.deptId })
          showMessage("删除成功", "success")
          dialogInstance.hide?.()
          loadingChildrenRef.current.clear()
          void tableRef.current?.refresh()
        } catch {
          /* 请求层已提示 */
        }
      },
      onClose: () => dialogInstance.hide?.(),
    })
  }

  const loadChildDepts = async (row: DeptRow) => {
    const key = String(row.deptId)
    if ((row.children as unknown) !== true || loadingChildrenRef.current.has(key)) return
    loadingChildrenRef.current.add(key)
    try {
      const search = getParams(searchRef.current?.getFieldsValue(true) ?? {})
      const data = await api.getDepts<DeptRow[]>({
        ...search,
        lazy: true,
        parentId: row.deptId,
      })
      const children = toLazyDeptRows(Array.isArray(data) ? data : [])
      tableRef.current?.getTable()?.appendTo(row.deptId, children as never)
    } finally {
      loadingChildrenRef.current.delete(key)
    }
  }

  return (
    <TableSection>
      <TableSection.Header>
        <SearchBox ref={searchRef} formConfig={formConfig} onSearch={handleSearch} />
      </TableSection.Header>
      <TableSection.ToolbarRight>
        <Button
          theme="primary"
          icon={<AddIcon />}
          onClick={() => setDialog({ visible: true, title: "添加部门" })}
        >
          新增
        </Button>
      </TableSection.ToolbarRight>
      <TableSection.Content>
        <BasicTable<DeptRow>
          ref={tableRef}
          rowKey="deptId"
          columns={columns}
          showPagination={false}
          request={async (params) => {
            const keyword = String(params.deptName ?? "").trim()
            if (keyword) {
              const data = await api.getDepts<DeptRow[]>(params)
              const rows = normalizeDeptTree(Array.isArray(data) ? data : [])
              return { rows, total: rows.length }
            }
            const data = await api.getDepts<DeptRow[]>({ ...params, lazy: true, parentId: 0 })
            const rows = toLazyDeptRows(Array.isArray(data) ? data : [])
            return { rows, total: rows.length }
          }}
          searchParams={() => getParams(searchRef.current?.getFieldsValue(true) ?? {})}
          tableProps={{
            tableLayout: "auto",
            tree: {
              childrenKey: "children",
              treeNodeColumnIndex: 0,
              indent: 24,
              expandTreeNodeOnClick: true,
              defaultExpandAll: false,
            },
            onTreeExpandChange: ({ row }) => {
              void loadChildDepts(row)
            },
          }}
        />
        {dialog.visible && (
          <AddDept
            visible={dialog.visible}
            title={dialog.title}
            deptId={dialog.deptId}
            parentId={dialog.parentId}
            onClose={(submitted) => {
              setDialog({ visible: false, title: "" })
              if (submitted) {
                loadingChildrenRef.current.clear()
                void tableRef.current?.refresh()
              }
            }}
          />
        )}
      </TableSection.Content>
    </TableSection>
  )
}
