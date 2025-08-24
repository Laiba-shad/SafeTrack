// Server/context/AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getData, removeData, storeData } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    status: "LOADING",
    token: null,
    user: null,
  });

  // Restore token once (app launch)
  useEffect(() => {
    (async () => {
      try {
        console.log("AuthContext: Checking for stored token");
        const token = await getData("token");
        const userStr = await getData("user");
        const user = userStr ? JSON.parse(userStr) : null;
        console.log("AuthContext: Found token:", !!token);
        console.log("AuthContext: Found user:", !!user);
        
        // Only set as authenticated if both token and user exist
        if (token && user) {
          setAppState({
            status: "AUTHENTICATED",
            token,
            user,
          });
        } else {
          // If token exists but user doesn't, clear the token and set to AUTH
          if (token) {
            await removeData("token");
          }
          setAppState({ status: "AUTH", token: null, user: null });
        }
      } catch (err) {
        console.error("AuthContext restore error", err);
        setAppState({ status: "AUTH", token: null, user: null });
      }
    })();
  }, []);

  const login = async (token, user) => {
    console.log("AuthContext: Logging in with token:", token);
    try {
      await storeData("token", token);
      if (user) {
        const shaped = {
          id: user.id || user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          circleId: user.circleId ?? null,
        };
        await storeData("user", JSON.stringify(shaped));
        await storeData("role", shaped.role ?? null);
        setAppState({ status: "AUTHENTICATED", token, user: shaped });
      } else {
        // If no user is provided, we cannot authenticate properly
        await removeData("token");
        setAppState({ status: "AUTH", token: null, user: null });
      }
    } catch (err) {
      console.error("Error during login storage", err);
      setAppState({ status: "AUTH", token: null, user: null });
    }
  };

  const logout = async () => {
    console.log("AuthContext: Logging out");
    try {
      await removeData("token");
      await removeData("user");
      await removeData("role");
      setAppState({ status: "AUTH", token: null, user: null });
    } catch (err) {
      console.error("Error during logout storage", err);
      setAppState({ status: "AUTH", token: null, user: null });
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    appState,
    login,
    logout
  }), [appState]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};