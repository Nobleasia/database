import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { MdOutlineArrowRightAlt } from "react-icons/md"

import { useDebounce, useHandleToast } from "@/hooks"

import { Button, Loader, RowPerPageButton } from "@/components"

import { useHomeTableColumns } from "../hooks"
import { globalFilterFuzzy } from "../utils"
import { HomeTable } from "./home-table"

export const HomeTableControl = ({
  isLoading = false,
  tableData = [],
  visibleColumnsObject = {},
  pageIndexWatch = 0,
  pageSizeWatch = 25,
  setValue = () => {},
  control = {},
  handleDeleteHome = () => {},
  queryWatch = "",
  columnFilters = [],
  setColumnFilters = () => {},
}) => {
  const router = useRouter()
  const { handleToggleToast } = useHandleToast()
  const queryWatchDebounced = useDebounce(queryWatch, 500)

  const columnsData = useHomeTableColumns({
    handleToggleToast,
    handleDeleteHome,
  })

  const columns = useMemo(() => [...columnsData], [columnsData])
  const data = useMemo(() => [...tableData], [tableData])

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: pageIndexWatch,
    pageSize: pageSizeWatch,
  })

  const [sorting, setSorting] = useState([])

  const pagination = useMemo(() => {
    return {
      pageIndex,
      pageSize,
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    setPagination({
      pageIndex: pageIndexWatch,
      pageSize: pageSizeWatch,
    })

    // Update `pageIndex` and `pageSize` in the form control
    setValue("pageIndex", pageIndexWatch)
    setValue("pageSize", pageSizeWatch)
  }, [pageIndexWatch, pageSizeWatch, setPagination, setValue])

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: pageIndex + 1,
      },
    })
  }, [pageIndex, pageSize])

  useEffect(() => {
    const page = router.query?.page
    if (page) {
      const pageIndex = Number(page) - 1
      setPagination(() => {
        return {
          pageIndex,
          pageSize,
        }
      })
    }
  }, [])

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility: visibleColumnsObject,
      globalFilter: queryWatchDebounced,
    },
    enableColumnFilters: true,
    enableFilters: true,
    enableSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    globalFilterFn: globalFilterFuzzy,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex h-[36rem] items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      {data.length <= 0 && !isLoading ? (
        <div className="flex h-[36rem] items-center justify-center">
          <p className="text-lg font-bold text-npa-neutral-800">
            There is no data available
          </p>
        </div>
      ) : (
        <HomeTable isLoading={isLoading} table={table} />
      )}

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <RowPerPageButton
          id="pageSize"
          name="pageSize"
          control={control}
          disabled={isLoading || data.length <= 0}
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
              <strong className="text-npa-neutral-800">
                {table.getFilteredRowModel().rows.length}
              </strong>{" "}
              records
            </p>
          </div>

          <div className="flex items-center">
            <Button
              variant="custom"
              disabled={
                isLoading || data.length <= 0 || !table.getCanPreviousPage()
              }
              onClick={() => {
                setPagination((prev) => {
                  return {
                    ...prev,
                    pageIndex: prev.pageIndex - 1,
                  }
                })
              }}
              className="flex items-center gap-1 rounded-tl-md rounded-bl-md border-1 border-r-[0.5px] border-r-white/40 bg-npa-charcoal-300 px-3 py-2 text-npa-charcoal-25 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-npa-neutral-50 disabled:text-npa-neutral-400/80 hover:[&:not(:disabled)]:bg-npa-charcoal-400 hover:[&:not(:disabled)]:text-npa-neutral-25"
            >
              <MdOutlineArrowRightAlt className="h-6 w-6 rotate-180" />
              Prev
            </Button>

            <Button
              variant="custom"
              disabled={
                isLoading || data.length <= 0 || !table.getCanNextPage()
              }
              onClick={() => {
                setPagination((prev) => {
                  return {
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                  }
                })
              }}
              className="flex items-center gap-1 rounded-tr-md rounded-br-md border-1 border-l-[0.5px] border-l-white/40 bg-npa-charcoal-300 px-3 py-2 text-npa-charcoal-25 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-npa-neutral-50 disabled:text-npa-neutral-400/80 hover:[&:not(:disabled)]:bg-npa-charcoal-400 hover:[&:not(:disabled)]:text-npa-neutral-25"
            >
              Next
              <MdOutlineArrowRightAlt className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
