import { useMemo } from "react"

import { Badge, TableActionsButtons } from "@/components"

import { convertNumberToPriceFormat } from "@/utils"
import { dateFormatter } from "@/utils/dateFormatter"

import { filterArrIncludesSome, filterPricingInNumberRange } from "../utils"

export const useHomeTableColumns = ({
  handleToggleToast,
  handleDeleteHome,
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
              handleDeletingData={handleDeleteHome}
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
        id: "name",
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: () => "Name",
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
        id: "sellingPrice",
        accessorFn: (row) => [row.selling_price, row.price_currency],
        cell: (info) => {
          const [price, currency] = info.getValue()
          return convertNumberToPriceFormat(price, currency)
        },
        header: () => "Selling Price",
        enableColumnFilter: true,
        filterFn: filterPricingInNumberRange,
      },
      {
        id: "rentalPrice",
        accessorFn: (row) => [row.rental_price, row.price_currency],
        cell: (info) => {
          const [price, currency] = info.getValue()
          return `${convertNumberToPriceFormat(price, currency)} /month`
        },
        header: () => "Rental Price",
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
        id: "buildingSize",
        accessorKey: "building_size",
        header: () => "Building Size (sqm)",
        enableColumnFilter: true,
        filterFn: "inNumberRange",
      },
      {
        id: "stories",
        accessorKey: "stories",
        header: () => "Stories",
        enableColumnFilter: true,
        filterFn: "inNumberRange",
      },
      {
        id: "furnishing",
        accessorKey: "furnishing",
        header: () => "Furnishing",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
      },
      {
        id: "bedroom",
        accessorKey: "bedroom",
        header: () => "Bedroom",
        enableColumnFilter: true,
        filterFn: "inNumberRange",
      },
      {
        id: "bathroom",
        accessorKey: "bathroom",
        header: () => "Bathroom",
        enableColumnFilter: true,
        filterFn: "inNumberRange",
      },
      {
        id: "studyRoom",
        accessorKey: "study_room",
        header: () => "Study Room",
        enableColumnFilter: true,
        filterFn: "inNumberRange",
      },
      {
        id: "carportOrGarage",
        accessorKey: "carport_or_garage",
        header: () => "Carport/Garage",
        enableColumnFilter: true,
        filterFn: "inNumberRange",
      },
      {
        id: "backyard",
        accessorKey: "backyard",
        cell: (info) => {
          return (
            <Badge variant={info.getValue() === "Yes" ? "green" : "red"}>
              {info.getValue() === "Yes" ? "Yes" : "No"}
            </Badge>
          )
        },
        header: () => "Backyard",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
      },
      {
        id: "swimmingPool",
        accessorKey: "swimming_pool",
        cell: (info) => {
          return (
            <Badge variant={info.getValue() === "Yes" ? "green" : "red"}>
              {info.getValue() === "Yes" ? "Yes" : "No"}
            </Badge>
          )
        },
        header: () => "Swimming Pool",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
      },
      {
        id: "houseType",
        accessorKey: "house_type",
        header: () => "House Type",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
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
        id: "picName",
        accessorKey: "property_person_in_charge",
        cell: (info) => {
          if (info.getValue() && info.getValue().fullname) {
            const { fullname } = info.getValue()
            return fullname
          }
          return null
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
          if (info.getValue() && info.getValue().phone_number) {
            const { phone_number: phoneNumber } = info.getValue()
            return phoneNumber
          }
          return null
        },
        header: () => "PIC Phone Number",
      },
      {
        id: "priceCurrency",
        accessorKey: "price_currency",
        header: () => "Price Currency",
        enableColumnFilter: true,
        filterFn: filterArrIncludesSome,
      },
      {
        id: "compoudFee",
        accessorFn: (row) => [row.compound_fee, row.price_currency],
        cell: (info) => {
          const [compoundFee, currency] = info.getValue()
          return convertNumberToPriceFormat(compoundFee, currency)
        },
        header: () => "Compound Fee",
      },
      {
        id: "compoudFeeCoverage",
        accessorKey: "compound_fee_coverage",
        cell: (info) => info.getValue(),
        header: () => "Compound Fee Coverage",
      },
      {
        id: "paymentTerms",
        accessorFn: (row) => row?.property_payment_term?.payment_term,
        header: () => "Payment Terms",
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
        id: "facilities",
        accessorKey: "facilities",
        cell: (info) => {
          return (
            <ul className="list-inside list-item">
              {info
                .getValue()
                .map(
                  ({
                    id,
                    property_facility_name: {
                      id: propertyFacilityNameId,
                      facility_name: facilityName,
                    },
                  }) => (
                    <li
                      key={`apartment-facility-list-item-${id}-${propertyFacilityNameId}`}
                      className="list-disc"
                    >
                      {facilityName}
                    </li>
                  )
                )}
            </ul>
          )
        },
        header: () => "Facilities",
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
