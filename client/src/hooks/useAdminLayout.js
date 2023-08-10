import { useContext } from "react";

import { AdminLayoutContext } from "@/context";

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);

  if (context === undefined) {
    throw new Error("useAdminLayout must be used within AdminLayoutContext");
  }

  return context;
};
