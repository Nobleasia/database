import { createContext, useMemo, useState } from "react";

export const HandleToastContext = createContext({});

export const HandleToastContextProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    variant: "",
  });

  const handleToggleToast = ({ open, message, variant }) => {
    setToast({
      open,
      message,
      variant,
    });
  };

  const value = useMemo(() => {
    return {
      toast,
      handleToggleToast,
    };
  }, [toast]);

  return (
    <HandleToastContext.Provider value={value}>
      {children}
    </HandleToastContext.Provider>
  );
};
