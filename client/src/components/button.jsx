import cn from "classnames";
import { forwardRef, useMemo } from "react";
import { ImSpinner8 } from "react-icons/im";

export const Button = forwardRef(
  (
    {
      children = "Button",
      type = "button",
      variant = "primary",
      disabled = false,
      loading = false,
      isFullWidth = true,
      ...props
    },
    forwadedRef
  ) => {
    const disabledState = useMemo(() => {
      return disabled || loading;
    }, [loading, disabled]);

    if (variant === "custom") {
      return (
        <button
          {...props}
          type={type}
          disabled={disabledState}
          ref={forwadedRef}
        >
          {loading && <ImSpinner8 className="animate-spin" />}
          {children}
        </button>
      );
    }

    return (
      <button
        {...props}
        type={type}
        disabled={disabledState}
        ref={forwadedRef}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg px-4 py-4 text-sm font-medium transition-all duration-300 focus:ring-[3px] disabled:cursor-not-allowed lg:text-base",
          {
            "bg-npa-charcoal-400 text-npa-neutral-25 focus:ring-npa-charcoal-400/50 hover:bg-npa-charcoal-600 active:bg-npa-charcoal-800":
              variant === "primary" && !loading && !disabledState, // default
            "disabled:border-1 disabled:border-npa-neutral-400 disabled:bg-npa-neutral-50 disabled:text-npa-neutral-300":
              variant === "primary" && !loading && disabledState, // disabled
            "cursor-progress bg-npa-charcoal-300":
              variant === "primary" && loading && disabledState, // loading (automatically triggering the disabled state)
          },
          {
            "border-1 border-npa-charcoal-900 focus:ring-npa-charcoal-900/60":
              variant === "outline",
            " bg-white text-neutral-900 hover:bg-npa-neutral-100 active:bg-npa-neutral-300":
              variant === "outline" && !loading && !disabledState,

            "bg-npa-neutral-50 opacity-60":
              variant === "outline" && !loading && disabledState,
            "bg-npa-neutral-100":
              variant === "outline" && loading && disabledState,

            "w-max": !isFullWidth,
            "w-full": isFullWidth,
          }
        )}
      >
        {loading && <ImSpinner8 className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
