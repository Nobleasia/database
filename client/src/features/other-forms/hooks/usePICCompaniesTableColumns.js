import { useMemo } from "react";

import { OtherFormsTableActionButtons } from "../components/other-form-table-action-buttons";

export const usePICCompaniesTableColumns = ({
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
            name: row.name,
          };
        },
        cell: (info) => {
          return (
            <OtherFormsTableActionButtons
              {...info.getValue()}
              editFormNameId="pic_company"
              handleDeleteDataOrigin={handleDeleteDataOrigin}
              mutateDataOrigin={mutateDataOrigin}
            />
          );
        },
        header: () => "Actions",
      },
      {
        id: "picCompanyName",
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: () => "PIC Company Name",
      },
    ];
  }, []);

  return tableColumns;
};
