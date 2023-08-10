import { useContext } from "react";

import { ViewPublicDataContext } from "../context";

export const useViewPublicData = () => {
  const context = useContext(ViewPublicDataContext);

  if (!context) {
    throw new Error(
      "useViewApartment must be used within a ViewApartmentProvider"
    );
  }

  return context;
};
