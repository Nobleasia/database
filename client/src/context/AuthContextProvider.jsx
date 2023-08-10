import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const value = useMemo(() => {
    return { auth, setAuth };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
