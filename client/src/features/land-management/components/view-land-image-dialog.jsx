import * as DialogRadix from "@radix-ui/react-dialog";
import { forwardRef } from "react";

export const ViewLandImageDialogTrigger = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DialogRadix.Trigger {...props} ref={forwardedRef}>
        {children}
      </DialogRadix.Trigger>
    );
  }
);

ViewLandImageDialogTrigger.displayName = "ViewLandImageDialogTrigger";
