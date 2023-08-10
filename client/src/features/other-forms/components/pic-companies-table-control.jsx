import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";

import { usePICCompaniesTableColumns } from "../hooks";
import { OtherFormsTableControl } from "./other-forms-table-control";

export const PICCompaniesTableControl = ({
  isLoading = false,
  tableData = [],
  pageSizeWatch = 25,
  totalDataCount = 0,
  control = {},
  mutateDataOrigin,
  handleDeleteDataOrigin,
}) => {
  const columnsData = usePICCompaniesTableColumns({
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
      pageSizeName="pageSizePicCompanies"
    />
  );
};
