import cn from "classnames";

export const GroupInput = ({
  children = null,
  direction = "row",
  className = "",
}) => {
  return (
    <div
      className={cn("flex gap-3", className, {
        "flex-col": direction === "column",
      })}
    >
      {children}
    </div>
  );
};
