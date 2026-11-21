import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button, type TableProps } from "tdesign-react"
import { SaveIcon } from "tdesign-icons-react"
import api from "@/api"
import BasicDialog from "@/components/BasicDialog"
import BasicTable, { type BasicTableRef } from "@/components/BasicTable"
import SearchBox, { type SearchBoxRef } from "@/components/SearchBox"
import type { FormConfig } from "@/interface"
import type { RoleUserConfig } from "@/interface/system/role"
import type { AuthUserRow } from "@/interface/system/user"
import type { AuthUserProps } from "@/interface/system/role"
import { getParams, showMessage } from "@/utils/methods"
import InputText from "@/components/InputText"

export type { AuthUserProps }

export default function AuthUser(props: AuthUserProps) {
  const { visible, roleId, roleName, onClose } = props
  const searchRef = useRef<SearchBoxRef>(null)
  const tableRef = useRef<BasicTableRef<AuthUserRow>>(null)
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([])
  const [saving, setSaving] = useState(false)

  const formConfig = useMemo<FormConfig[]>(
    () => [
      {
        label: "账号",
        name: "userName",
        component: <InputText clearable placeholder="请输入账号" />,
      },
      {
        label: "昵称",
        name: "nickName",
        component: <InputText clearable placeholder="请输入昵称" />,
      },
    ],
    [],
  )

  const columns = useMemo<TableProps<AuthUserRow>["columns"]>(
    () => [
      { colKey: "row-select", type: "multiple", width: 48 },
      { title: "账号", colKey: "userName", ellipsis: true, cell: ({ row }) => row.userName || row.account || "-" },
      { title: "昵称", colKey: "nickName", ellipsis: true },
    ],
    [],
  )

  const loadSelectedUsers = useCallback(async () => {
    if (!roleId) return
    try {
      const data = await api.getUserConfig<RoleUserConfig>({ roleId })
      const { rows = [] } = data || {}
      setSelectedKeys((Array.isArray(rows) ? rows : []).map((item) => String(item.userId)))
    } catch {
      setSelectedKeys([])
    }
  }, [roleId])

  useEffect(() => {
    if (!visible) return
    void loadSelectedUsers()
  }, [visible, loadSelectedUsers])

  /** 保存角色与用户的关联关系 */
  const handleSave = async () => {
    if (!selectedKeys.length) {
      showMessage("请选择用户", "warning")
      return
    }
    setSaving(true)
    try {
      await api.setUserConfig<void>({
        roleId,
        userList: selectedKeys,
      })
      showMessage("用户分配保存成功", "success")
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <BasicDialog
      visible={visible}
      header={roleName ? `分配用户 - ${roleName}` : "分配用户"}
      width={760}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button theme="primary" icon={<SaveIcon />} loading={saving} onClick={() => void handleSave()}>
            保存
          </Button>
        </>
      }
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <SearchBox
          ref={searchRef}
          formConfig={formConfig}
          fieldsPerRow={2}
          onSearch={() => void tableRef.current?.refresh({ resetCurrent: true })}
        />
        <div className="h-105">
          <BasicTable<AuthUserRow>
            ref={tableRef}
            rowKey="userId"
            columns={columns}
            request={api.getUserList<AuthUserRow>}
            searchParams={() => getParams(searchRef.current?.getFieldsValue(true) ?? {})}
            tableProps={{
              size: "small",
              selectedRowKeys: selectedKeys,
              onSelectChange: (keys) => setSelectedKeys(keys as Array<string | number>),
            }}
          />
        </div>
      </div>
    </BasicDialog>
  )
}
