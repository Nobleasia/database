import { useMemo } from "react"

import { dateFormatter } from "@/utils"

import { UserManagementTableActionButtons } from "../components/user-management-table-action-buttons"

export const useUserTableColumns = ({
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
            username: row?.username,
            fullname: row?.fullname,
            role: row?.role,
          }
        },
        cell: (info) => {
          return (
            <UserManagementTableActionButtons
              {...info.getValue()}
              editFormNameId="user"
              mutateDataOrigin={mutateDataOrigin}
              handleDeleteDataOrigin={handleDeleteDataOrigin}
            />
          )
        },
        header: () => "Actions",
      },
      {
        id: "username",
        accessorKey: "username",
        cell: (info) => info.getValue(),
        header: () => "Username",
      },
      {
        id: "role",
        accessorKey: "role",
        cell: (info) => info.getValue(),
        header: () => "Role",
      },
      {
        id: "updatedAt",
        accessorKey: "updated_at",
        cell: (info) => dateFormatter(info.getValue()),
        header: () => "Last Update",
      },
    ]
  }, [])

  return tableColumns
}
