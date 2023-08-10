import { useMemo } from "react";

import { dateFormatter } from "@/utils";

import { OtherFormsTableActionButtons } from "../components/other-form-table-action-buttons";

export const usePICTableColumns = ({
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
            fullname: row?.fullname,
            phoneNumber: row?.phone_number,
            roleName: row?.property_person_in_charge_role?.name,
            companyName: row?.property_person_in_charge_company?.name,
          };
        },
        cell: (info) => {
          return (
            <OtherFormsTableActionButtons
              {...info.getValue()}
              editFormNameId="pic"
              mutateDataOrigin={mutateDataOrigin}
              handleDeleteDataOrigin={handleDeleteDataOrigin}
            />
          );
        },
        header: () => "Actions",
      },
      {
        id: "picName",
        accessorKey: "fullname",
        cell: (info) => info.getValue(),
        header: () => "PIC Name",
      },
      {
        id: "picRole",
        accessorKey: "property_person_in_charge_role",
        cell: (info) => {
          return info?.getValue()?.name;
        },

        header: () => "PIC Role",
      },
      {
        id: "picCompany",
        accessorKey: "property_person_in_charge_company",
        cell: (info) => {
          return info?.getValue()?.name;
        },
        header: () => "PIC Company",
      },
      {
        id: "picPhoneNumber",
        accessorKey: "phone_number",
        cell: (info) => info.getValue(),
        header: () => "PIC Phone Number",
      },
      {
        id: "updatedAt",
        accessorKey: "updated_at",
        cell: (info) => dateFormatter(info.getValue()),
        header: () => "Last Update",
      },
    ];
  }, []);

  return tableColumns;
};
