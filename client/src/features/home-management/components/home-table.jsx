import { flexRender } from "@tanstack/react-table"
import cn from "classnames"
import { RxCaretDown, RxCaretSort, RxCaretUp } from "react-icons/rx"

import {
  Loader,
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components"

const HomeTableCell = ({ children }) => {
  return (
    <TableData className="max-h-24 w-44 px-6 py-4 text-sm text-npa-neutral-700">
      <span className="line-clamp-4">{children}</span>
    </TableData>
  )
}

export const HomeTable = ({ isLoading, table }) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex h-full max-h-screen flex-col items-center justify-center gap-12 overflow-hidden rounded-md bg-white/40 p-5 backdrop-blur-sm">
          <Loader />
        </div>
      )}
      <div
        className={cn(
          "relative flex max-h-[36rem] flex-col rounded-xl backdrop-blur-md",
          {
            "min-h-[36rem] overflow-hidden": isLoading,
            "overflow-auto": !isLoading,
          }
        )}
      >
        <Table className="w-max">
          <TableHead className="sticky -top-[1px]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeader
                    key={header.id}
                    className="whitespace-nowrap px-6 py-4 text-left font-medium text-npa-neutral-700"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        {...{
                          className: cn(
                            "inline-flex items-center justify-between gap-7",
                            {
                              "cursor-pointer":
                                header.column.getCanSort() &&
                                header.id !== "actions",
                              "cursor-default": header.id === "actions",
                            }
                          ),
                          onClick:
                            header.id === "actions"
                              ? null
                              : header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {{
                          asc: <RxCaretUp className="h-auto w-5" />,
                          desc: <RxCaretDown className="h-auto w-5" />,
                        }[header.column.getIsSorted()] ?? (
                          <RxCaretSort className="h-auto w-5" />
                        )}
                      </button>
                    )}
                  </TableHeader>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={cn("border-b border-[#E0E0E0]", {
                  "bg-npa-neutral-100/80": index % 2 === 0,
                })}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <HomeTableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </HomeTableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
