import { useMemo } from "react";

import { OtherFormsTableActionButtons } from "../components/other-form-table-action-buttons";

export const useAreaTableColumns = ({
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
            regionName: row.region_name,
          };
        },
        cell: (info) => {
          return (
            <OtherFormsTableActionButtons
              {...info.getValue()}
              editFormNameId="property_area"
              handleDeleteDataOrigin={handleDeleteDataOrigin}
              mutateDataOrigin={mutateDataOrigin}
            />
          );
        },
        header: () => "Actions",
      },
      {
        id: "regionName",
        accessorKey: "region_name",
        cell: (info) => info.getValue(),
        header: () => "Region Name",
      },
    ];
  }, []);

  return tableColumns;
};
