import { forwardRef, useImperativeHandle, useRef } from "react"
import { EnhancedTable, type EnhancedTableRef, type TableRowData } from "tdesign-react"
import useTableQuery from "@/hooks/use-table-query"
import type { BasicTableProps, BasicTableRef } from "@/interface/components"
import "./index.css"

export type { BasicTableProps, BasicTableRef }

/**
 * 通用业务表格：固定表头 + flex 撑满高度 + 内置分页数据逻辑。
 * - 传 `request`：远程分页
 * - 不传 `request`：本地模式，通过 ref.setTableData / addRow 维护数据
 */
function BasicTableInner<T extends TableRowData>(props: BasicTableProps<T>, ref: React.ForwardedRef<BasicTableRef<T>>) {
  const {
    columns = [],
    rowKey = "id",
    request,
    searchParams,
    autoRequest = true,
    showPagination = true,
    height = "100%",
    tableProps,
  } = props
  const tableRef = useRef<EnhancedTableRef>(null)

  const {
    dataSource,
    loading,
    pagination,
    refresh,
    setTableData,
    addRow,
    addRows,
    updateRow,
    updateRowByKey,
    removeRow,
    removeRowByKey,
    getDataSource,
  } = useTableQuery<T>({
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
      updateRow,
      updateRowByKey,
      removeRow,
      removeRowByKey,
      getDataSource,
      getTable: () => tableRef.current,
    }),
    [refresh, setTableData, addRow, addRows, updateRow, updateRowByKey, removeRow, removeRowByKey, getDataSource],
  )

  const { height: tableHeight, ...restTableProps } = tableProps ?? {}

  return (
    <div className="basic-table flex h-full min-h-0 flex-1 flex-col">
      <EnhancedTable<T>
        ref={tableRef}
        rowKey={rowKey}
        columns={columns}
        height={tableHeight ?? height}
        data={dataSource}
        bordered
        cellEmptyContent="-"
        pagination={pagination}
        {...restTableProps}
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
