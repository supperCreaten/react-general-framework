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
import AddMenu from "./components/AddMenu"
import { renderMenuIcon } from "./components/renderMenuIcon"
import { MENU_TYPE_LABEL } from "./constants"
import type { MenuRow } from "@/interface/menu"
import type { MenuDialogState } from "@/interface/menu"

/** 规范化菜单树（统一 menuId 为字符串） */
function normalizeMenuTree(list: MenuRow[] = []): MenuRow[] {
  return list.map((item) => {
    const children = Array.isArray(item.children) && item.children.length ? normalizeMenuTree(item.children) : undefined
    return {
      ...item,
      menuId: String(item.menuId),
      children,
    }
  })
}

/** 将菜单行转为懒加载子节点占位 */
function toLazyMenuRows(list: MenuRow[] = []): MenuRow[] {
  return markLazyChildren(list as Array<Record<string, unknown>>, { idKey: "menuId" }) as unknown as MenuRow[]
}

export default function MenuPage() {
  const searchRef = useRef<SearchBoxRef>(null)
  const tableRef = useRef<BasicTableRef<MenuRow>>(null)
  const loadingChildrenRef = useRef<Set<string>>(new Set())
  const [dialog, setDialog] = useState<MenuDialogState>({ visible: false, title: "" })
  const formConfig = useMemo<FormConfig[]>(
    () => [
      {
        label: "菜单名称",
        name: "menuName",
        component: <InputText clearable placeholder="请输入菜单名称" />,
      },
      {
        label: "状态",
        name: "status",
        component: (
          <Select
            clearable
            placeholder="菜单状态"
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

  const columns = useMemo<TableProps<MenuRow>["columns"]>(
    () => [
      {
        title: "菜单名称",
        colKey: "menuName",
        minWidth: 220,
        ellipsis: true,
      },
      {
        title: "图标",
        colKey: "icon",
        width: 72,
        align: "center",
        cell: ({ row }) => renderMenuIcon(row.icon),
      },
      {
        title: "排序",
        colKey: "orderNum",
        width: 72,
        align: "center",
      },
      {
        title: "权限标识",
        colKey: "perms",
        minWidth: 140,
        align: "center",
        ellipsis: true,
        cell: ({ row }) => row.perms || "—",
      },
      {
        title: "类型",
        colKey: "menuType",
        width: 88,
        align: "center",
        cell: ({ row }) => MENU_TYPE_LABEL[`${row.menuType}`] ?? "—",
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
      { title: "创建人", colKey: "createBy", align: "center", minWidth: 100, ellipsis: true },
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
                  setDialog({ visible: true, title: "修改菜单", menuId: String(row.menuId) }),
              },
              {
                key: "add",
                label: "新增",
                onClick: () =>
                  setDialog({ visible: true, title: "新增菜单", menuId: String(row.menuId) }),
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

  /** 按搜索条件刷新菜单表格 */
  const handleSearch = () => {
    loadingChildrenRef.current.clear()
    void tableRef.current?.refresh({ resetCurrent: true })
  }

  /** 删除菜单项（含确认框） */
  const handleDelete = (row: MenuRow) => {
    const dialogInstance = DialogPlugin.confirm({
      header: "提示",
      body: `是否确认删除名称为「${row.menuName}」的数据项？`,
      onConfirm: async () => {
        try {
          await api.deleteMenu<void>({ menuId: row.menuId })
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

  const loadChildMenus = async (row: MenuRow) => {
    const key = String(row.menuId)
    if ((row.children as unknown) !== true || loadingChildrenRef.current.has(key)) return
    loadingChildrenRef.current.add(key)
    try {
      const search = getParams(searchRef.current?.getFieldsValue(true) ?? {})
      const data = await api.getMenus<MenuRow[]>({
        ...search,
        lazy: true,
        parentId: row.menuId,
      })
      const children = toLazyMenuRows(Array.isArray(data) ? data : [])
      tableRef.current?.getTable()?.appendTo(row.menuId, children as never)
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
          onClick={() => {
            setDialog({ visible: true, title: "新增菜单" })
          }}
        >
          新增
        </Button>
      </TableSection.ToolbarRight>
      <TableSection.Content>
        <BasicTable<MenuRow>
          ref={tableRef}
          rowKey="menuId"
          columns={columns}
          showPagination={false}
          request={async (params) => {
            const keyword = String(params.menuName ?? "").trim()
            if (keyword) {
              const data = await api.getMenus<MenuRow[]>(params)
              const rows = normalizeMenuTree(Array.isArray(data) ? data : [])
              return { rows, total: rows.length }
            }
            const data = await api.getMenus<MenuRow[]>({ ...params, lazy: true, parentId: 0 })
            const rows = toLazyMenuRows(Array.isArray(data) ? data : [])
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
              void loadChildMenus(row)
            },
          }}
        />
        {dialog.visible && (
          <AddMenu
            visible={dialog.visible}
            title={dialog.title}
            menuId={dialog.menuId}
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
