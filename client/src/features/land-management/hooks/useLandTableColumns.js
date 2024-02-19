import { useMemo } from "react"

import { Badge, TableActionsButtons } from "@/components"

import { convertNumberToPriceFormat } from "@/utils"
import { dateFormatter } from "@/utils/dateFormatter"

import { filterArrIncludesSome, filterPricingInNumberRange } from "../utils"

export const useLandTableColumns = ({
  handleToggleToast,
  handleDeleteLand,
}) => {
  const tableColumns = useMemo(() => {
    return [
      {
        id: "actions",
        accessorFn: (row) => {
          return row.kode_propar
        },
        cell: (info) => {
          const kodePropar = info.getValue()
          return (
            <TableActionsButtons
              slug={kodePropar}
              onToggleToast={handleToggleToast}
              handleDeletingData={handleDeleteLand}
            />
          )
        },
        header: () => "Actions",
      },
      {
        id: "kodePropar",
        accessorKey: "kode_propar",
        cell: (info) => info.getValue(),
        header: () => "Kode Propar",
      },
      {
        id: "address",
        accessorKey: "address",
        cell: (info) => info.getValue(),
        header: () => "Address",
      },
      {
        id: "area",
        accessorFn: (row) => row?.property_area?.region_name,
        cell: (info) => info.getValue(),
        header: () => "Area",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
      },
      {
        id: "price",
        accessorFn: (row) => [row.price],
        cell: (info) => {
          const [price] = info.getValue()
          return `${convertNumberToPriceFormat(price, "Rupiah")} /sqm`
        },
        header: () => "Price",
        enableColumnFilter: true,
        filterFn: filterPricingInNumberRange,
      },
      {
        id: "landSize",
        accessorKey: "land_size",
        header: () => "Land Size (sqm)",
        enableColumnFilter: true,
        filterFn: "inNumberRange",
      },
      {
        id: "availability",
        accessorKey: "available",
        cell: (info) => {
          return (
            <Badge variant={info.getValue() === "Yes" ? "green" : "red"}>
              {info.getValue() === "Yes" ? "Yes" : "No"}
            </Badge>
          )
        },
        header: () => "Availability",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
      },
      {
        id: "zone",
        accessorKey: "zone",
        cell: (info) => {
          return (
            <Badge variant={info?.getValue()?.toLowerCase()}>
              {info?.getValue()?.value}
            </Badge>
          )
        },
        header: () => "Zone",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
      },
      {
        id: "surroundings",
        accessorKey: "surroundings",
        header: () => "Surroundings",
      },
      {
        id: "picName",
        accessorKey: "property_person_in_charge",
        cell: (info) => {
          return info.getValue().fullname
        },
        header: () => "PIC Name",
      },
      {
        id: "picRole",
        accessorKey: "property_person_in_charge",
        cell: (info) => {
          if (
            info.getValue() !== null &&
            info.getValue().property_person_in_charge_role !== null
          ) {
            const { name } = info.getValue().property_person_in_charge_role
            return name
          }
          return null
        },
        header: () => "PIC Role",
      },
      {
        id: "picPhoneNumber",
        accessorKey: "property_person_in_charge",
        cell: (info) => {
          const { phone_number: phoneNumber } = info.getValue()
          return phoneNumber
        },
        header: () => "PIC Phone Number",
      },
      {
        id: "paymentTerms",
        accessorFn: (row) => row?.property_payment_term?.payment_term,
        header: () => "Payment Terms",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (filterValue.length === 0) return true

          const rowValue = row.getValue(columnId)

          return filterValue.includes(rowValue)
        },
      },
      {
        id: "leaseTerms",
        accessorFn: (row) => [row.lease_term_time, row.lease_term_type],
        cell: (info) => {
          const [leaseTermTime, leaseTermType] = info.getValue()

          return `${leaseTermTime} ${leaseTermType}${
            leaseTermTime > 1 ? "s" : ""
          }`
        },
        header: () => "Lease Terms",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const { min, max, leaseTermsTypes } = filterValue
          const [leaseTermTime, leaseTermType] = row.getValue(columnId)

          const isWithinLeaseTermRange =
            leaseTermTime >= min && leaseTermTime <= max

          const isLeaseTermTypeIncluded =
            leaseTermsTypes.length === 0 ||
            leaseTermsTypes.includes(leaseTermType)

          return isWithinLeaseTermRange && isLeaseTermTypeIncluded
        },
      },
      {
        id: "taxFee",
        accessorFn: (row) => {
          const {
            vat_percentage: vatPercentage,
            vat_is_included: vatIsIncluded,
            wht_percentage: whtPercentage,
            wht_is_included: whtIsIncluded,
          } = row
          const includedTextContent = (condition) =>
            condition ? "Included" : "Excluded"

          return [
            `${vatPercentage}% VAT ${includedTextContent(vatIsIncluded)}`,
            `${whtPercentage}% WHT ${includedTextContent(whtIsIncluded)}`,
          ]
        },
        cell: (info) => {
          const [VAT, WHT] = info.getValue()

          return (
            <div className="flex flex-col gap-1">
              <span>{VAT},</span>
              <span>{WHT}</span>
            </div>
          )
        },
        header: () => "Tax Fee",
      },
      {
        id: "remarks1",
        accessorKey: "remarks_1",
        cell: (info) => (
          <p className="w-[180px] whitespace-pre-wrap line-clamp-4">
            {info.getValue() || "No Remark"}
          </p>
        ),
        header: () => "Remarks 1",
      },
      {
        id: "remarks2",
        accessorKey: "remarks_2",
        cell: (info) => (
          <p className="w-[180px] whitespace-pre-wrap line-clamp-4">
            {info.getValue() || "No Remark"}
          </p>
        ),
        header: () => "Remarks 2",
      },
      {
        id: "remarks3",
        accessorKey: "remarks_3",
        cell: (info) => (
          <p className="w-[180px] whitespace-pre-wrap line-clamp-4">
            {info.getValue() || "No Remark"}
          </p>
        ),
        header: () => "Remarks 3",
      },
      {
        id: "updatedAt",
        accessorFn: (row) => dateFormatter(row.updated_at),
        cell: (info) => (
          <p className="w-[180px] whitespace-pre-wrap line-clamp-4">
            {info.getValue()}
          </p>
        ),
        header: () => "Last Update",
      },
    ]
  }, [])

  return tableColumns
}
