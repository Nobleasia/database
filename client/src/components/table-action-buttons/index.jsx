import { useAuth } from "@/hooks";

import { TableActionEditButton } from "./table-action-edit-button";
import { TableActionRemoveButton } from "./table-action-remove-button";
import { TableActionViewButton } from "./table-action-view-button";

export const TableActionsButtons = ({
  slug = "",
  onToggleToast = () => {},
  handleDeletingData = () => {},
  withoutView = false,
}) => {
  const { auth } = useAuth();
  return (
    <div
      className={`flex items-center gap-2 ${
        auth?.user_role === "user" && "justify-center"
      }`}
    >
      {!withoutView && <TableActionViewButton slug={slug} />}
      {/* <TableActionViewButton slug={slug} /> */}
      {auth?.user_role !== "user" && (
        <>
          <TableActionEditButton slug={slug} />
          <TableActionRemoveButton
            slug={slug}
            onToggleToast={onToggleToast}
            handleDeletingData={handleDeletingData}
          />
        </>
      )}
    </div>
  );
};
