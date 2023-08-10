import * as DialogRadix from "@radix-ui/react-dialog";
import cn from "classnames";
import { forwardRef } from "react";

import styles from "./Dialog.module.css";

export const DialogRoot = DialogRadix.Root;
export const DialogTrigger = DialogRadix.Trigger;
export const DialogClose = DialogRadix.Close;
export const DialogPortal = DialogRadix.Portal;

export const DialogOverlay = forwardRef(({ ...props }, forwardedRef) => {
  return (
    <DialogRadix.Overlay
      {...props}
      ref={forwardedRef}
      className={cn(props.className, styles.DialogOverlay)}
    />
  );
});

export const DialogContent = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DialogRadix.Content
        {...props}
        ref={forwardedRef}
        className={cn(props.className, styles.DialogContent)}
      >
        {children}
      </DialogRadix.Content>
    );
  }
);

export const DialogTitle = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DialogRadix.Content
        {...props}
        ref={forwardedRef}
        className={cn(props.className, styles.DialogTitle)}
      >
        {children}
      </DialogRadix.Content>
    );
  }
);

export const DialogDescription = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DialogRadix.Content
        {...props}
        ref={forwardedRef}
        className={cn(props.className, styles.DialogDescription)}
      >
        {children}
      </DialogRadix.Content>
    );
  }
);

DialogOverlay.displayName = "DialogOverlay";
DialogContent.displayName = "DialogContent";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";
