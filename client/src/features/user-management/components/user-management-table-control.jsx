import { MdOutlineArrowRightAlt } from "react-icons/md";

import { Button, Loader, RowPerPageButton } from "@/components";

import { UserManagementTable } from "./user-management-table";

export const UserManagementTableControl = ({
  table,
  tableData,
  control,
  isLoading,
  totalDataCount,
  pageSizeName,
}) => {
  if (isLoading) {
    return (
      <div className="flex h-[36rem] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      {tableData.length <= 0 && !isLoading ? (
        <div className="flex h-full min-h-[224px] items-center justify-center">
          <p className="text-lg font-bold text-npa-neutral-800">
            There is no data available
          </p>
        </div>
      ) : (
        <UserManagementTable isLoading={isLoading} table={table} />
      )}

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <RowPerPageButton
          id={pageSizeName}
          name={pageSizeName}
          control={control}
          disabled={isLoading || tableData.length <= 0}
        />

        <div className="flex h-max flex-col items-center gap-2">
          <div className="flex flex-col gap-1 text-center">
            <p>
              Showing page{" "}
              <strong className="text-npa-neutral-800">
                {table.getState().pagination.pageIndex + 1}
              </strong>{" "}
              of{" "}
              <strong className="text-npa-neutral-800">
                {table.getPageCount()}
              </strong>{" "}
              Pages
            </p>
            <p>
              Total of{" "}
              <strong className="text-npa-neutral-800">{totalDataCount}</strong>{" "}
              records
            </p>
          </div>

          <div className="flex items-center">
            <Button
              variant="custom"
              disabled={
                isLoading ||
                tableData.length <= 0 ||
                !table.getCanPreviousPage()
              }
              onClick={() => table.previousPage()}
              className="flex items-center gap-1 rounded-tl-md rounded-bl-md border-1 border-r-[0.5px] border-r-white/40 bg-npa-charcoal-300 px-3 py-2 text-npa-charcoal-25 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-npa-neutral-50 disabled:text-npa-neutral-400/80 hover:[&:not(:disabled)]:bg-npa-charcoal-400 hover:[&:not(:disabled)]:text-npa-neutral-25"
            >
              <MdOutlineArrowRightAlt className="h-6 w-6 rotate-180" />
              Prev
            </Button>

            <Button
              variant="custom"
              disabled={
                isLoading || tableData.length <= 0 || !table.getCanNextPage()
              }
              onClick={() => table.nextPage()}
              className="flex items-center gap-1 rounded-tr-md rounded-br-md border-1 border-l-[0.5px] border-l-white/40 bg-npa-charcoal-300 px-3 py-2 text-npa-charcoal-25 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-npa-neutral-50 disabled:text-npa-neutral-400/80 hover:[&:not(:disabled)]:bg-npa-charcoal-400 hover:[&:not(:disabled)]:text-npa-neutral-25"
            >
              Next
              <MdOutlineArrowRightAlt className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
