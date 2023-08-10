import { useMemo } from "react"

import { OtherFormsTableActionButtons } from "../components/other-form-table-action-buttons"

export const useFacilitiesTableColumns = ({
  handleDeleteDataOrigin,
  mutateDataOrigin,
}) => {
  const tableColumns = useMemo(() => {
    return [
      {
        id: "actions",
        accessorFn: (row) => {
          return {
            id: row.id,
            facilityName: row.facility_name,
          }
        },
        cell: (info) => {
          return (
            <OtherFormsTableActionButtons
              {...info.getValue()}
              editFormNameId="property_facilities"
              handleDeleteDataOrigin={handleDeleteDataOrigin}
              mutateDataOrigin={mutateDataOrigin}
            />
          )
        },
        header: () => "Actions",
      },
      {
        id: "facility",
        accessorKey: "facility_name",
        cell: (info) => info.getValue(),
        header: () => "Facility",
      },
    ]
  }, [])

  return tableColumns
}
