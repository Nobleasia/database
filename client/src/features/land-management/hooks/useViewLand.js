import { useContext } from "react";

import { ViewLandDataContext } from "../context";

export const useViewLandData = () => {
  const context = useContext(ViewLandDataContext);

  if (!context) {
    throw new Error(
      "useViewLand must be used within a ViewLandProvider"
    );
  }

  return context;
};
