import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useMemo } from "react"

import { useFacilitiesTableColumns } from "../hooks"
import { OtherFormsTableControl } from "./other-forms-table-control"

export const FacilitiesTableControl = ({
  isLoading = false,
  tableData = [],
  pageSizeWatch = 25,
  totalDataCount = 0,
  control = {},
  mutateDataOrigin,
  handleDeleteDataOrigin,
}) => {
  const columnsData = useFacilitiesTableColumns({
    mutateDataOrigin,
    handleDeleteDataOrigin,
  })

  const columns = useMemo(() => [...columnsData], [columnsData])
  const data = useMemo(() => [...tableData], [tableData])

  console.log(data)

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: true,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  })

  useEffect(() => {
    table.setPageSize(pageSizeWatch)
  }, [table, pageSizeWatch])

  return (
    <OtherFormsTableControl
      table={table}
      tableData={tableData}
      control={control}
      isLoading={isLoading}
      totalDataCount={totalDataCount}
      pageSizeName="pageSizeFacilities"
    />
  )
}
