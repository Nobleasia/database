import { useContext } from "react";

import { PersistUserLoginContext } from "@/context";

export const usePersistUserLogin = () => {
  const context = useContext(PersistUserLoginContext);

  if (context === undefined) {
    throw new Error(
      "usePersistUserLogin must be used within PersistUserLoginContext"
    );
  }

  return context;
};
