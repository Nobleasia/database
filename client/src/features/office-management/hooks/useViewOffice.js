import { useContext } from "react";

import { ViewOfficeDataContext } from "../context";

export const useViewOfficeData = () => {
  const context = useContext(ViewOfficeDataContext);

  if (!context) {
    throw new Error("useViewOffice must be used within a ViewOfficeProvider");
  }

  return context;
};
