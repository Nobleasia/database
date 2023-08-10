import { AddUserDialog } from "../add-user-dialog";

export const UserManagementTableActionEditButton = ({
  editFormNameId,
  mutateDataOrigin,
  ...props
}) => {
  const editFormNameIdObject = {
    user: AddUserDialog,
  };

  const EditFormComponent = editFormNameIdObject[editFormNameId];

  return (
    <EditFormComponent
      {...props}
      isEditMode
      mutateDataOrigin={mutateDataOrigin}
    />
  );
};
