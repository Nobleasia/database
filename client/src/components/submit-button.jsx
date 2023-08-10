import cn from "classnames";
import { forwardRef } from "react";
import { ImSpinner8 } from "react-icons/im";

export const SubmitButton = forwardRef(function SubmitButton(
  { children, isSubmitting, className, ...props },
  forwardedRef
) {
  return (
    <button
      type="submit"
      className={className}
      ref={forwardedRef}
      disabled={isSubmitting}
      {...props}
    >
      <ImSpinner8
        className={cn("animate-spin", {
          block: isSubmitting,
          hidden: !isSubmitting,
        })}
      />
      {children}
    </button>
  );
});
