import cn from "classnames";

export const AdminLayoutSidebarOverlay = ({
  sidebarIsOpen,
  setSidebarIsOpen,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn("flex-1 bg-black/40 backdrop-blur-[2px] md:hidden", {
        "opacity-0": !sidebarIsOpen,
        "opacity-100 delay-[350ms] duration-200": sidebarIsOpen,
      })}
      onClick={() => setSidebarIsOpen(false)}
    />
  );
};
