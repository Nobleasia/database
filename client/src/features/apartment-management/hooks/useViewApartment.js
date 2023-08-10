import { useContext } from "react";

import { ViewApartmentDataContext } from "../context";

export const useViewApartmentData = () => {
  const context = useContext(ViewApartmentDataContext);

  if (!context) {
    throw new Error(
      "useViewApartment must be used within a ViewApartmentProvider"
    );
  }

  return context;
};
