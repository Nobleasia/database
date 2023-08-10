import cn from "classnames";

export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  ...props
}) => {
  return (
    <div
      data-testid="badge-component"
      {...props}
      className={cn("w-max rounded-md border-1 text-sm", {
        "border-npa-neutral-300 bg-npa-neutral-50 text-npa-neutral-500":
          variant === "default" || /[^green|red|blue|yellow]/gi.test(variant),
        "border-npa-success-300 bg-npa-success-50 text-npa-success-500":
          variant === "green",
        "border-npa-error-300 bg-npa-error-50 text-npa-error-500":
          variant === "red",
        "border-npa-info-300 bg-npa-info-50 text-npa-info-500":
          variant === "blue",
        "border-npa-warning-300 bg-npa-warning-50 text-npa-warning-500":
          variant === "yellow",
        "py-1 px-2": size === "sm",
        "py-2 px-3": size === "md",
        "py-3 px-4": size === "lg",
      })}
    >
      {children}
    </div>
  );
};
