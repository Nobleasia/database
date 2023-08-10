import cn from "classnames";

import { useAdminLayout } from "@/hooks";

export const AdminLayoutContainer = ({ children }) => {
  const { sidebarIsOpen } = useAdminLayout();
  return (
    <div
      className={cn("relative grid h-screen min-h-max overflow-hidden", {
        "md:grid-cols-[250px_1fr]": sidebarIsOpen,
        "md:grid-cols-[max-content_1fr]": !sidebarIsOpen,
      })}
    >
      {children}
    </div>
  );
};
