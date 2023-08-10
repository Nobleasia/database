import * as DialogRadix from "@radix-ui/react-dialog";
import { forwardRef } from "react";

export const ViewHomeImageDialogTrigger = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DialogRadix.Trigger {...props} ref={forwardedRef}>
        {children}
      </DialogRadix.Trigger>
    );
  }
);

ViewHomeImageDialogTrigger.displayName = "ViewHomeImageDialogTrigger";
