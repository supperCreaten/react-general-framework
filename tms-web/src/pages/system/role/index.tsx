import { useMemo, useRef, useState } from "react"
import { Button, DialogPlugin, Select, Switch, type TableProps } from "tdesign-react"
import { UserAddIcon } from "tdesign-icons-react"
import api from "@/api"
import BasicTable, { type BasicTableRef } from "@/components/BasicTable"
import MoreActions from "@/components/MoreActions"
import SearchBox, { type SearchBoxRef } from "@/components/SearchBox"
import TableSection from "@/components/TableSection"
import type { FormConfig } from "@/interface"
import type { RoleRow } from "@/interface/system/role"
import type { RoleAuthDialogState, RoleDialogState } from "@/interface/system/role"
import { getParams, showMessage } from "@/utils/methods"
import InputText from "@/components/InputText"
import AddRole from "./components/AddRole"
import AuthUser from "./components/AuthUser"

export default function RolePage() {
  const searchRef = useRef<SearchBoxRef>(null)
  const tableRef = useRef<BasicTableRef<RoleRow>>(null)
  const [roleDialog, setRoleDialog] = useState<RoleDialogState>({ visible: false, title: "" })
  const [authDialog, setAuthDialog] = useState<RoleAuthDialogState>({ visible: false })

  const formConfig = useMemo<FormConfig[]>(
    () => [
      {
        label: "角色编码",
        name: "roleCode",
        component: <InputText clearable placeholder="请输入角色编码" />,
      },
      {
        label: "角色名称",
        name: "roleName",
        component: <InputText clearable placeholder="请输入角色名称" />,
      },
      {
        label: "角色状态",
        name: "status",
        component: (
          <Select
            clearable
            placeholder="请选择状态"
            options={[
              { label: "启用", value: "0" },
              { label: "禁用", value: "1" },
            ]}
          />
        ),
      },
    ],
    [],
  )

  const columns = useMemo<TableProps<RoleRow>["columns"]>(
    () => [
      {
        title: "角色编码",
        colKey: "roleCode",
        width: 140,
        align: "center",
        fixed: "left",
        ellipsis: true,
        cell: ({ row }) => row.roleCode || "-",
      },
      {
        title: "角色名称",
        colKey: "roleName",
        align: "center",
        minWidth: 140,
        ellipsis: true,
      },
      {
        title: "权限字符",
        colKey: "roleKey",
        align: "center",
        minWidth: 140,
        ellipsis: true,
        cell: ({ row }) => row.roleKey || "-",
      },
      {
        title: "关联用户数",
        colKey: "userCount",
        width: 110,
        align: "center",
        cell: ({ row }) => row.userCount ?? 0,
      },
      {
        title: "状态",
        colKey: "status",
        width: 100,
        align: "center",
        cell: ({ row }) => (
          <Switch
            value={String(row.status) === "0"}
            onChange={async (checked) => {
              try {
                await api.updateRoleStatus<void>({ roleId: row.roleId, status: checked ? "0" : "1" })
                showMessage("修改状态成功", "success")
                void tableRef.current?.refresh()
              } catch {
                /* 请求层已提示 */
              }
            }}
          />
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
                  setRoleDialog({ visible: true, title: "修改角色", roleId: String(row.roleId) }),
              },
              {
                key: "authUser",
                label: "分配用户",
                onClick: () =>
                  setAuthDialog({
                    visible: true,
                    roleId: String(row.roleId),
                    roleName: row.roleName,
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

  /** 按搜索条件刷新角色表格 */
  const handleSearch = () => {
    void tableRef.current?.refresh({ resetCurrent: true })
  }

  /** 删除单条角色（含确认框） */
  const handleDelete = (row: RoleRow) => {
    const dialogInstance = DialogPlugin.confirm({
      header: "提示",
      body: `确定删除角色「${row.roleName}」吗？`,
      onConfirm: async () => {
        try {
          await api.deleteRole<void>({ roleId: row.roleId })
          showMessage("删除成功", "success")
          dialogInstance.hide?.()
          void tableRef.current?.refresh()
        } catch {
          /* 请求层已提示 */
        }
      },
      onClose: () => dialogInstance.hide?.(),
    })
  }

  return (
    <TableSection>
      <TableSection.Header>
        <SearchBox ref={searchRef} formConfig={formConfig} onSearch={handleSearch} />
      </TableSection.Header>
      <TableSection.ToolbarRight>
        <Button
          theme="primary"
          icon={<UserAddIcon />}
          onClick={() => setRoleDialog({ visible: true, title: "新增角色" })}
        >
          新增
        </Button>
      </TableSection.ToolbarRight>
      <TableSection.Content>
        <BasicTable<RoleRow>
          ref={tableRef}
          rowKey="roleId"
          columns={columns}
          request={api.getRoleList<RoleRow>}
          searchParams={() => getParams(searchRef.current?.getFieldsValue(true) ?? {})}
          tableProps={{ tableLayout: "auto" }}
        />
        {roleDialog.visible && (
          <AddRole
            visible={roleDialog.visible}
            title={roleDialog.title}
            roleId={roleDialog.roleId}
            onClose={(submitted) => {
              setRoleDialog({ visible: false, title: "" })
              if (submitted) void tableRef.current?.refresh()
            }}
          />
        )}
        {authDialog.visible && (
          <AuthUser
            visible={authDialog.visible}
            roleId={authDialog.roleId}
            roleName={authDialog.roleName}
            onClose={() => setAuthDialog({ visible: false })}
          />
        )}
      </TableSection.Content>
    </TableSection>
  )
}
