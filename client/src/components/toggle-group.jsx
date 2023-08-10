import * as ToggleGroupRadix from "@radix-ui/react-toggle-group";
import { forwardRef } from "react";

export const ToggleGroupRoot = forwardRef(
  ({ children, type = "single", ...props }, forwardedRef) => {
    return (
      <ToggleGroupRadix.Root type={type} ref={forwardedRef} {...props}>
        {children}
      </ToggleGroupRadix.Root>
    );
  }
);

export const ToggleGroupItem = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <ToggleGroupRadix.Item {...props} ref={forwardedRef}>
        {children}
      </ToggleGroupRadix.Item>
    );
  }
);

ToggleGroupRoot.displayName = "ToggleGroupRoot";
ToggleGroupItem.displayName = "ToggleGroupItem";
