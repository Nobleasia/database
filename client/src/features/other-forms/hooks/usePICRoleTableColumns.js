import { useMemo } from "react";

import { OtherFormsTableActionButtons } from "../components/other-form-table-action-buttons";

export const usePICRoleTableColumns = ({
  handleDeleteDataOrigin,
  mutateDataOrigin,
}) => {
  const tableColumns = useMemo(() => {
    return [
      {
        id: "actions",
        accessorFn: (row) => {
          return { id: row.id, name: row.name };
        },
        cell: (info) => {
          return (
            <OtherFormsTableActionButtons
              {...info.getValue()}
              editFormNameId="pic_role"
              handleDeleteDataOrigin={handleDeleteDataOrigin}
              mutateDataOrigin={mutateDataOrigin}
            />
          );
        },
        header: () => "Actions",
      },
      {
        id: "picRoleName",
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: () => "PIC Role",
      },
    ];
  }, []);

  return tableColumns;
};
