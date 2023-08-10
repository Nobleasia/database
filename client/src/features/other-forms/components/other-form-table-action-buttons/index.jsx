import { OtherFormsTableActionEditButton } from "./other-forms-table-action-edit-button";
import { OtherFormsTableActionRemoveButton } from "./other-forms-table-action-remove-button";

export const OtherFormsTableActionButtons = ({
  editFormNameId,
  handleDeleteDataOrigin,
  mutateDataOrigin,
  ...props
}) => {
  return (
    <div className="flex items-center gap-2">
      <OtherFormsTableActionEditButton
        {...props}
        mutateDataOrigin={mutateDataOrigin}
        handleDeleteDataOrigin={handleDeleteDataOrigin}
        editFormNameId={editFormNameId}
      />
      <OtherFormsTableActionRemoveButton
        id={props.id}
        handleDeleteDataOrigin={handleDeleteDataOrigin}
      />
    </div>
  );
};
