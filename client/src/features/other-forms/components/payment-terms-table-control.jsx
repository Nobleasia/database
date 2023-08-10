import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";

import { usePaymentTermsTableColumns } from "../hooks";
import { OtherFormsTableControl } from "./other-forms-table-control";

export const PaymentTermsTableControl = ({
  isLoading = false,
  tableData = [],
  pageSizeWatch = 25,
  totalDataCount = 0,
  control = {},
  handleDeleteDataOrigin = () => {},
  mutateDataOrigin = () => {},
}) => {
  const columnsData = usePaymentTermsTableColumns({
    handleDeleteDataOrigin,
    mutateDataOrigin,
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
      pageSizeName="pageSizePaymentTerms"
    />
  );
};
