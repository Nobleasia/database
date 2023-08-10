import { forwardRef } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";

import { Button } from "@/components";

export const UserManagementDialogButton = forwardRef(
  ({ children, isEditMode, ...props }, forwardedRef) => {
    return !isEditMode ? (
      <Button {...props} ref={forwardedRef}>
        <AiFillPlusCircle className="h-5 w-5" />
        {children}
      </Button>
    ) : (
      <Button
        {...props}
        ref={forwardedRef}
        variant="custom"
        className="rounded-md bg-npa-success-400 px-[6px] py-2 text-white transition-all duration-200 hover:bg-npa-success-500 active:bg-npa-success-600"
      >
        <RiPencilFill className="h-4 w-4" />
      </Button>
    );
  }
);

UserManagementDialogButton.displayName = "UserManagementDialogButton";
