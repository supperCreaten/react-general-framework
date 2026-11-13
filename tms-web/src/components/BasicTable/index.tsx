import { forwardRef, useImperativeHandle, useRef } from "react"
import {
  EnhancedTable,
  type EnhancedTableProps,
  type EnhancedTableRef,
  type TableRowData,
} from "tdesign-react"
import useTableQuery, { type UseTableQueryOptions, type UseTableQueryReturn } from "@/hooks/use-table-query"
import "./index.css"

/** BasicTable 命令式句柄（供父组件调用 refresh / 本地改数 / 树表懒加载） */
export type BasicTableRef<T extends TableRowData> = Pick<
  UseTableQueryReturn<T>,
  "refresh" | "setTableData" | "addRow" | "addRows"
> & {
  /** 底层 EnhancedTable 实例（树表 appendTo / setData 等） */
  getTable: () => EnhancedTableRef | null
}

export type BasicTableProps<T extends TableRowData> = {
  columns: EnhancedTableProps<T>["columns"]
  rowKey?: string
  /** 远程请求；不传则为本地模式 */
  request?: UseTableQueryOptions<T>["request"]
  /** 查询条件；对象变化会重查，函数则每次请求时取值 */
  searchParams?: UseTableQueryOptions<T>["searchParams"]
  /** 挂载后是否自动请求，默认 true（仅远程） */
  autoRequest?: boolean
  /** 是否分页，默认 true；菜单树表等传 false */
  showPagination?: boolean
  /** 透传给 TDesign EnhancedTable（支持 tree） */
  tableProps?: Omit<
    EnhancedTableProps<T>,
    "columns" | "data" | "pagination" | "cellEmptyContent" | "height" | "rowKey" | "loading" | "loadingProps"
  >
}

/**
 * 通用业务表格：固定表头 + flex 撑满高度 + 内置分页数据逻辑。
 * - 传 `request`：远程分页
 * - 不传 `request`：本地模式，通过 ref.setTableData / addRow 维护数据
 */
function BasicTableInner<T extends TableRowData>(props: BasicTableProps<T>, ref: React.ForwardedRef<BasicTableRef<T>>) {
  const { columns = [], rowKey, request, searchParams, autoRequest = true, showPagination = true, tableProps } = props
  const tableRef = useRef<EnhancedTableRef>(null)

  const { dataSource, loading, pagination, refresh, setTableData, addRow, addRows } = useTableQuery<T>({
    request,
    searchParams,
    autoRequest,
    enablePagination: showPagination,
  })

  useImperativeHandle(
    ref,
    () => ({
      refresh,
      setTableData,
      addRow,
      addRows,
      getTable: () => tableRef.current,
    }),
    [refresh, setTableData, addRow, addRows],
  )

  return (
    <div className="basic-table flex h-full min-h-0 flex-1 flex-col">
      <EnhancedTable<T>
        ref={tableRef}
        rowKey={rowKey || "id"}
        columns={columns}
        height="100%"
        data={dataSource}
        bordered
        cellEmptyContent="-"
        pagination={pagination}
        {...tableProps}
        loading={loading}
        loadingProps={{
          text: "数据加载中...",
          size: "medium",
          showOverlay: true,
        }}
      />
    </div>
  )
}

const BasicTable = forwardRef(BasicTableInner) as <T extends TableRowData>(
  props: BasicTableProps<T> & { ref?: React.ForwardedRef<BasicTableRef<T>> },
) => React.ReactElement

export default BasicTable
