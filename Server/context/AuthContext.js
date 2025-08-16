import { createContext, useContext, useEffect, useState } from "react";
import { getData, removeData, storeData } from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    status: "LOADING",
    token: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getData("token");
      setAppState({ status: token ? "AUTHENTICATED" : "AUTH", token });
    };
    checkAuth();
  }, []);

  const login = async (token) => {
    await storeData("token", token);
    setAppState({ status: "AUTHENTICATED", token });
  };

  const logout = async () => {
    await removeData("token");
    setAppState({ status: "AUTH", token: null });
  };

  return (
    <AuthContext.Provider value={{ appState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);