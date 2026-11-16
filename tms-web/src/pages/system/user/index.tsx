import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import {
  Button,
  Card,
  Col,
  DialogPlugin,
  Input,
  Row,
  Switch,
  Tree,
  type TableProps,
  type TreeProps,
} from "tdesign-react"
import { AddIcon, DeleteIcon, FileExportIcon } from "tdesign-icons-react"
import api from "@/api"
import BasicTable, { type BasicTableRef } from "@/components/BasicTable"
import MoreActions from "@/components/MoreActions"
import SearchBox, { type SearchBoxRef } from "@/components/SearchBox"
import TableSection from "@/components/TableSection"
import type { FormConfig } from "@/interface"
import { getParams, showMessage } from "@/utils/methods"
import { markLazyChildren } from "@/utils/tree/lazy"
import AddUser from "./components/AddUser"
import AuthRole from "./components/AuthRole"
import ResetPwd from "./components/ResetPwd"

type UserRow = {
  userId: string | number
  userName?: string
  account?: string
  nickName?: string
  deptName?: string
  postName?: string
  phone?: string
  phonenumber?: string
  status?: string | number
  createTime?: string
}

type DeptTreeNode = {
  deptId: string
  deptName: string
  hasChildren?: boolean
  children?: DeptTreeNode[] | boolean
}

type UserDialogState = {
  visible: boolean
  title: string
  userId?: string
  defaultDeptId?: string
}

type AuthDialogState = {
  visible: boolean
  userId?: string
  userName?: string
}

type ResetPwdDialogState = {
  visible: boolean
  userId?: string
  userName?: string
  account?: string
}

type UserPageState = {
  deptKeyword: string
  deptTree: DeptTreeNode[]
  selectedDeptId?: string
  selectedKeys: Array<string | number>
  userDialog: UserDialogState
  authDialog: AuthDialogState
  resetPwdDialog: ResetPwdDialogState
}

const initialUserPageState: UserPageState = {
  deptKeyword: "",
  deptTree: [],
  selectedDeptId: undefined,
  selectedKeys: [],
  userDialog: { visible: false, title: "" },
  authDialog: { visible: false },
  resetPwdDialog: { visible: false },
}

function userPageReducer(state: UserPageState, patch: Partial<UserPageState>): UserPageState {
  return { ...state, ...patch }
}

function normalizeDeptTree(list: Array<Record<string, unknown>> = []): DeptTreeNode[] {
  return list.map((item) => {
    const children = Array.isArray(item.children)
      ? normalizeDeptTree(item.children as Array<Record<string, unknown>>)
      : undefined
    return {
      deptId: String(item.deptId),
      deptName: String(item.deptName ?? ""),
      children: children?.length ? children : undefined,
    }
  })
}

function toLazyDeptNodes(list: Array<Record<string, unknown>> = []): DeptTreeNode[] {
  return markLazyChildren(list, { idKey: "deptId" }).map((item) => ({
    ...item,
    deptName: String(item.deptName ?? ""),
  })) as DeptTreeNode[]
}

async function loadDeptChildren(parentId: string | number) {
  const data = await api.getDepts({ lazy: true, parentId, status: "0" })
  return toLazyDeptNodes(Array.isArray(data) ? (data as Array<Record<string, unknown>>) : [])
}

export default function UserPage() {
  const searchRef = useRef<SearchBoxRef>(null)
  const tableRef = useRef<BasicTableRef<UserRow>>(null)
  const [state, dispatch] = useReducer(userPageReducer, initialUserPageState)
  const { deptKeyword, deptTree, selectedDeptId, selectedKeys, userDialog, authDialog, resetPwdDialog } = state
  /** 首屏部门数据就绪后再挂载 Tree，避免 TDesign Tree 在未 mount 完时异步 setState */
  const [deptTreeReady, setDeptTreeReady] = useState(false)

  const treeKeys = useMemo(() => ({ label: "deptName", value: "deptId", children: "children" }), [])
  const selectedDeptIdRef = useRef<string | null>(null)
  selectedDeptIdRef.current = selectedDeptId ?? null
  const isDeptSearch = Boolean(deptKeyword.trim())

  const loadDeptTree = useCallback(async (keyword = "") => {
    const text = keyword.trim()
    try {
      if (text) {
        const data = await api.getDepts({ status: "0", deptName: text })
        dispatch({
          deptTree: normalizeDeptTree(Array.isArray(data) ? (data as Array<Record<string, unknown>>) : []),
        })
        return
      }
      dispatch({ deptTree: await loadDeptChildren(0) })
    } finally {
      setDeptTreeReady(true)
    }
  }, [])

  const onTreeLoad = useCallback<NonNullable<TreeProps["load"]>>(async (node) => {
    return loadDeptChildren(node.value as string | number)
  }, [])

  useEffect(() => {
    void loadDeptTree(deptKeyword)
  }, [deptKeyword, loadDeptTree])

  const formConfig = useMemo<FormConfig[]>(
    () => [
      {
        label: "账号",
        name: "account",
        component: <Input clearable placeholder="请输入账号" />,
      },
      {
        label: "昵称",
        name: "nickName",
        component: <Input clearable placeholder="请输入昵称" />,
      },
      {
        label: "手机号码",
        name: "phone",
        component: <Input clearable placeholder="请输入手机号码" />,
      },
    ],
    [],
  )

  const handleSearch = () => {
     tableRef.current?.refresh({ resetCurrent: true })
  }

  const openAdd = useCallback(
    (userId?: string) => {
      dispatch({
        userDialog: {
          visible: true,
          title: userId ? "修改用户" : "新增用户",
          userId,
          defaultDeptId: userId ? undefined : selectedDeptId,
        },
      })
    },
    [selectedDeptId],
  )

  const handleDelete = useCallback((rows: UserRow[]) => {
    if (!rows.length) {
      showMessage("请选择要删除的用户", "warning")
      return
    }
    const names = rows.map((item) => item.nickName || item.userName || item.userId).join("、")
    const dialogInstance = DialogPlugin.confirm({
      header: "提示",
      body: `是否确认删除用户「${names}」？`,
      onConfirm: async () => {
        try {
          for (const row of rows) {
            await api.deleteUser({ userId: row.userId })
          }
          showMessage("删除成功", "success")
          dialogInstance.hide?.()
          dispatch({ selectedKeys: [] })
          void tableRef.current?.refresh()
        } catch {
          /* 请求层已提示 */
        }
      },
      onClose: () => dialogInstance.hide?.(),
    })
  }, [])

  const handleToolbarDelete = () => {
    const rows = selectedKeys.map((id) => ({ userId: id })) as UserRow[]
    handleDelete(rows)
  }

  const columns = useMemo<TableProps<UserRow>["columns"]>(
    () => [
      { colKey: "row-select", type: "multiple", width: 50, fixed: "left" },
      {
        title: "用户编号",
        colKey: "userId",
        width: 100,
        align: "center",
        fixed: "left",
        ellipsis: true,
      },
      {
        title: "账号",
        colKey: "userName",
        align: "center",
        minWidth: 120,
        ellipsis: true,
        cell: ({ row }) => row.userName || row.account || "-",
      },
      {
        title: "昵称",
        colKey: "nickName",
        align: "center",
        minWidth: 120,
        ellipsis: true,
      },
      {
        title: "部门",
        colKey: "deptName",
        align: "center",
        minWidth: 140,
        ellipsis: true,
        cell: ({ row }) => row.deptName || "-",
      },
      {
        title: "岗位",
        colKey: "postName",
        align: "center",
        minWidth: 120,
        ellipsis: true,
        cell: ({ row }) => row.postName || "-",
      },
      {
        title: "手机号码",
        colKey: "phone",
        align: "center",
        minWidth: 130,
        ellipsis: true,
        cell: ({ row }) => row.phone || row.phonenumber || "-",
      },
      {
        title: "启用状态",
        colKey: "status",
        width: 100,
        align: "center",
        cell: ({ row }) => (
          <Switch
            value={String(row.status) === "0"}
            onChange={async (checked) => {
              try {
                await api.updateUserStatus({ userId: row.userId, status: checked ? "0" : "1" })
                showMessage("修改状态成功", "success")
                void tableRef.current?.refresh()
              } catch {
                /* 请求层已提示 */
              }
            }}
          />
        ),
      },
      {
        title: "创建时间",
        colKey: "createTime",
        align: "center",
        minWidth: 170,
        ellipsis: true,
      },
      {
        title: "操作",
        colKey: "operation",
        width: 200,
        align: "center",
        fixed: "right",
        cell: ({ row }) => (
          <MoreActions
            items={[
              {
                key: "edit",
                label: "修改",
                onClick: () => openAdd(String(row.userId)),
              },
              {
                key: "delete",
                label: "删除",
                theme: "danger",
                onClick: () => handleDelete([row]),
              },
              {
                key: "resetPwd",
                label: "重置密码",
                onClick: () =>
                  dispatch({
                    resetPwdDialog: {
                      visible: true,
                      userId: String(row.userId),
                      userName: row.nickName,
                      account: row.userName || row.account,
                    },
                  }),
              },
              {
                key: "authRole",
                label: "分配角色",
                onClick: () =>
                  dispatch({
                    authDialog: {
                      visible: true,
                      userId: String(row.userId),
                      userName: row.nickName || row.userName,
                    },
                  }),
              },
            ]}
          />
        ),
      },
    ],
    [openAdd, handleDelete],
  )

  const onTreeActive: TreeProps["onActive"] = (_value, context) => {
    const raw = context?.node?.value ?? (context?.node?.data as { deptId?: string | number } | undefined)?.deptId
    if (raw == null || raw === "") return
    const next = String(raw)
    if (next === selectedDeptIdRef.current) return
    selectedDeptIdRef.current = next
    dispatch({ selectedDeptId: next })
    void tableRef.current?.refresh({ resetCurrent: true })
  }

  return (
    <TableSection>
      <TableSection.Header>
        <SearchBox ref={searchRef} formConfig={formConfig} fieldsPerRow={3} onSearch={handleSearch} />
      </TableSection.Header>

      <TableSection.ToolbarRight>
        <Button theme="primary" icon={<AddIcon />} onClick={() => openAdd()}>
          新增
        </Button>
        <Button theme="danger" variant="outline" icon={<DeleteIcon />} onClick={handleToolbarDelete}>
          删除
        </Button>
        <Button theme="warning" variant="outline" icon={<FileExportIcon />}>
          导出
        </Button>
      </TableSection.ToolbarRight>

      <TableSection.Content>
        <Row gutter={12} align="stretch" className="h-full min-h-0" style={{ height: "100%", margin: 0 }}>
          <Col span={3} className="h-full min-h-0" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Card
              bordered
              title="部门"
              className="box-border flex h-full min-h-0 flex-1 flex-col overflow-hidden"
              style={{ height: "100%" }}
              bodyClassName="box-border flex min-h-0 flex-1 flex-col overflow-hidden p-3"
            >
              <Input
                clearable
                className="mb-3 shrink-0"
                placeholder="请输入部门名称"
                value={deptKeyword}
                onChange={(value) => dispatch({ deptKeyword: String(value ?? "") })}
              />
              <div className="min-h-0 flex-1 overflow-auto">
                {deptTreeReady ? (
                  <Tree
                    key={isDeptSearch ? "dept-search" : "dept-lazy"}
                    data={deptTree}
                    keys={treeKeys}
                    activable
                    hover
                    expandAll={isDeptSearch}
                    load={isDeptSearch ? undefined : onTreeLoad}
                    actived={selectedDeptId ? [selectedDeptId] : []}
                    onActive={onTreeActive}
                  />
                ) : null}
              </div>
            </Card>
          </Col>

          <Col span={9} className="h-full min-h-0" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
              <BasicTable<UserRow>
                ref={tableRef}
                rowKey="userId"
                columns={columns}
                request={api.getUserList}
                searchParams={() =>
                  getParams({
                    ...(searchRef.current?.getFieldsValue(true) ?? {}),
                    ...(selectedDeptId ? { deptId: selectedDeptId } : {}),
                  })
                }
                tableProps={{
                  tableLayout: "auto",
                  selectedRowKeys: selectedKeys,
                  onSelectChange: (keys) => dispatch({ selectedKeys: keys as Array<string | number> }),
                }}
              />
            </div>
          </Col>
        </Row>

        {userDialog.visible && (
          <AddUser
            visible={userDialog.visible}
            title={userDialog.title}
            userId={userDialog.userId}
            defaultDeptId={userDialog.defaultDeptId}
            onClose={(submitted) => {
              dispatch({ userDialog: { visible: false, title: "" } })
              if (submitted) {
                dispatch({ selectedKeys: [] })
                void tableRef.current?.refresh()
              }
            }}
          />
        )}
        {authDialog.visible && (
          <AuthRole
            visible={authDialog.visible}
            userId={authDialog.userId}
            userName={authDialog.userName}
            onClose={(submitted) => {
              dispatch({ authDialog: { visible: false } })
              if (submitted) void tableRef.current?.refresh()
            }}
          />
        )}
        {resetPwdDialog.visible && (
          <ResetPwd
            visible={resetPwdDialog.visible}
            userId={resetPwdDialog.userId}
            userName={resetPwdDialog.userName}
            account={resetPwdDialog.account}
            onClose={() => dispatch({ resetPwdDialog: { visible: false } })}
          />
        )}
      </TableSection.Content>
    </TableSection>
  )
}
