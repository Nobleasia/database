import { useContext } from "react";

import { HandleToastContext } from "@/context";

export const useHandleToast = () => {
  const context = useContext(HandleToastContext);

  if (context === undefined) {
    throw new Error("useHandleToast must be used within HandleToastContext");
  }

  return context;
};
