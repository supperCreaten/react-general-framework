import { useMemo, useRef, useState } from "react"
import { Button, DialogPlugin, Input, Select, Tag, type TableProps } from "tdesign-react"
import { AddIcon } from "tdesign-icons-react"
import api from "@/api"
import BasicTable, { type BasicTableRef } from "@/components/BasicTable"
import SearchBox, { type SearchBoxRef } from "@/components/SearchBox"
import TableSection from "@/components/TableSection"
import type { FormConfig } from "@/interface"
import { getParams, showMessage } from "@/utils/methods"
import AddPost from "./components/AddPost"

type PostRow = {
  postId: string | number
  postCode: string
  postName: string
  postSort?: number
  status?: string | number
  createTime?: string
  remark?: string
}

type PostDialogState = {
  visible: boolean
  title: string
  postId?: string
}

export default function PostPage() {
  const searchRef = useRef<SearchBoxRef>(null)
  const tableRef = useRef<BasicTableRef<PostRow>>(null)
  const [dialog, setDialog] = useState<PostDialogState>({ visible: false, title: "" })

  const formConfig = useMemo<FormConfig[]>(
    () => [
      {
        label: "岗位编码",
        name: "postCode",
        component: <Input clearable placeholder="请输入岗位编码" />,
      },
      {
        label: "岗位名称",
        name: "postName",
        component: <Input clearable placeholder="请输入岗位名称" />,
      },
      {
        label: "状态",
        name: "status",
        component: (
          <Select
            clearable
            placeholder="岗位状态"
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

  const columns = useMemo<TableProps<PostRow>["columns"]>(
    () => [
      {
        title: "岗位编号",
        colKey: "postId",
        width: 100,
        align: "center",
        fixed: "left",
        cell: ({ row }) => row.postId ?? "-",
      },
      {
        title: "岗位编码",
        colKey: "postCode",
        align: "center",
        minWidth: 120,
        ellipsis: true,
      },
      {
        title: "岗位名称",
        colKey: "postName",
        align: "center",
        minWidth: 140,
        ellipsis: true,
      },
      {
        title: "岗位排序",
        colKey: "postSort",
        width: 100,
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
        width: 160,
        align: "center",
        fixed: "right",
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center justify-center gap-1">
            <Button
              theme="primary"
              variant="text"
              onClick={() =>
                setDialog({ visible: true, title: "修改岗位", postId: String(row.postId) })
              }
            >
              修改
            </Button>
            <Button theme="danger" variant="text" onClick={() => handleDelete(row)}>
              删除
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const handleSearch = () => {
    void tableRef.current?.refresh({ resetCurrent: true })
  }

  const handleDelete = (row: PostRow) => {
    const dialogInstance = DialogPlugin.confirm({
      header: "提示",
      body: `是否确认删除岗位「${row.postName}」？`,
      onConfirm: async () => {
        try {
          await api.deletePost({ postId: row.postId })
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
          icon={<AddIcon />}
          onClick={() => setDialog({ visible: true, title: "添加岗位" })}
        >
          新增
        </Button>
      </TableSection.ToolbarRight>
      <TableSection.Content>
        <BasicTable<PostRow>
          ref={tableRef}
          rowKey="postId"
          columns={columns}
          request={api.getPostList}
          searchParams={() => getParams(searchRef.current?.getFieldsValue(true) ?? {})}
          tableProps={{ tableLayout: "auto" }}
        />
        {dialog.visible && (
          <AddPost
            visible={dialog.visible}
            title={dialog.title}
            postId={dialog.postId}
            onClose={(submitted) => {
              setDialog({ visible: false, title: "" })
              if (submitted) void tableRef.current?.refresh()
            }}
          />
        )}
      </TableSection.Content>
    </TableSection>
  )
}
