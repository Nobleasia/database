import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";

import { useAreaTableColumns } from "../hooks";
import { OtherFormsTableControl } from "./other-forms-table-control";

export const AreaTableControl = ({
  isLoading = false,
  tableData = [],
  pageSizeWatch = 25,
  totalDataCount = 0,
  control = {},
  mutateDataOrigin,
  handleDeleteDataOrigin,
}) => {
  const columnsData = useAreaTableColumns({
    mutateDataOrigin,
    handleDeleteDataOrigin,
  });

  const columns = useMemo(() => [...columnsData], [columnsData]);
  const data = useMemo(() => [...tableData], [tableData]);

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
  });

  useEffect(() => {
    table.setPageSize(pageSizeWatch);
  }, [table, pageSizeWatch]);

  return (
    <OtherFormsTableControl
      table={table}
      tableData={tableData}
      control={control}
      isLoading={isLoading}
      totalDataCount={totalDataCount}
      pageSizeName="pageSizeArea"
    />
  );
};
