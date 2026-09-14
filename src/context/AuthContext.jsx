import { createContext, useContext, useState, useCallback } from "react";
import api from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = useCallback(async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    const newToken = res?.data?.data?.token;
    if (!newToken) {
      throw new Error("No token received from server");
    }
    localStorage.setItem("token", newToken);
    setToken(newToken);
    return newToken;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
