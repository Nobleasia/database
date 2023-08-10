import * as CheckboxRadix from "@radix-ui/react-checkbox";
import cn from "classnames";
import { forwardRef } from "react";
import { MdCheck } from "react-icons/md";

export const Checkbox = forwardRef(({ ...props }, forwardedRef) => {
  return (
    <CheckboxRadix.Root
      {...props}
      ref={forwardedRef}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-md border-2 border-npa-purple-400 outline-none ring-npa-purple-300/30 duration-200 focus:ring-[3px] focus:ring-npa-purple-400/50 data-[state=checked]:bg-npa-purple-400 data-[state=checked]:ring-4 active:ring-4 active:ring-npa-purple-400/30"
      )}
    >
      <div role="checkbox" aria-checked={props.checked}>
        <CheckboxRadix.Indicator>
          <MdCheck className="h-5 w-5 text-npa-neutral-50" />
        </CheckboxRadix.Indicator>
      </div>
    </CheckboxRadix.Root>
  );
});

Checkbox.displayName = "Checkbox";
