import { createContext, useEffect, useMemo, useState } from "react";

export const PersistUserLoginContext = createContext({});

export const PersistUserLoginContextProvider = ({ children }) => {
  const [isPersistUserLogin, setIsPersistUserLogin] = useState(false);

  useEffect(() => {
    setIsPersistUserLogin(
      JSON.parse(localStorage.getItem("persist_user_login")) || false
    );

    localStorage.setItem(
      "persist_user_login",
      localStorage.getItem("persist_user_login") || false
    );
  }, []);

  const value = useMemo(() => {
    return { isPersistUserLogin, setIsPersistUserLogin };
  }, [isPersistUserLogin]);

  return (
    <PersistUserLoginContext.Provider value={value}>
      {children}
    </PersistUserLoginContext.Provider>
  );
};
