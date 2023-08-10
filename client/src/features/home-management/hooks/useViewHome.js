import { useContext } from "react";

import { ViewHomeDataContext } from "../context";

export const useViewHomeData = () => {
  const context = useContext(ViewHomeDataContext);

  if (!context) {
    throw new Error("useViewHome must be used within a ViewHomeProvider");
  }

  return context;
};
