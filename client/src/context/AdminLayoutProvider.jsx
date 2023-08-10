import { createContext, useEffect, useMemo, useState } from "react";

export const AdminLayoutContext = createContext({});

export const AdminLayoutContextProvider = ({ children }) => {
  const [isUnderMDScreen, setIsUnderMDScreen] = useState(false);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  useEffect(() => {
    setSidebarIsOpen(window.innerWidth >= 768);
    setIsUnderMDScreen(window.innerWidth <= 767);
  }, []);

  const value = useMemo(() => {
    return {
      isUnderMDScreen,
      sidebarIsOpen,
      setIsUnderMDScreen,
      setSidebarIsOpen,
    };
  }, [isUnderMDScreen, sidebarIsOpen]);

  return (
    <AdminLayoutContext.Provider value={value}>
      {children}
    </AdminLayoutContext.Provider>
  );
};
