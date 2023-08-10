import { UserManagementTableActionEditButton } from "./user-management-table-action-edit-button";
import { UserManagementTableActionRemoveButton } from "./user-management-table-action-remove-button";

export const UserManagementTableActionButtons = ({
  editFormNameId,
  handleDeleteDataOrigin,
  mutateDataOrigin,
  ...props
}) => {
  return (
    <div className="flex items-center gap-2">
      <UserManagementTableActionEditButton
        {...props}
        mutateDataOrigin={mutateDataOrigin}
        handleDeleteDataOrigin={handleDeleteDataOrigin}
        editFormNameId={editFormNameId}
      />
      <UserManagementTableActionRemoveButton
        username={props.username}
        handleDeleteDataOrigin={handleDeleteDataOrigin}
      />
    </div>
  );
};
