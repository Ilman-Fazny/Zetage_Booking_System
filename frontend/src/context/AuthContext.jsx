import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../lib/api";

const AuthContext = createContext(null);
const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("auth_token");
    const loginTime = localStorage.getItem("login_time");
    if (savedToken && loginTime) {
      if (Date.now() - Number(loginTime) < SESSION_DURATION) {
        setAuthToken(savedToken);
        return savedToken;
      }
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth_user");
    const loginTime = localStorage.getItem("login_time");
    if (savedUser && loginTime) {
      if (Date.now() - Number(loginTime) < SESSION_DURATION) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  function login(jwt, userData) {
    setToken(jwt);
    setUser(userData);
    setAuthToken(jwt);
    localStorage.setItem("auth_token", jwt);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("login_time", Date.now().toString());
  }

  function logout() {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("login_time");
    sessionStorage.removeItem("hasChosenBookingType");
  }

  useEffect(() => {
    const loginTime = localStorage.getItem("login_time");
    if (token && loginTime) {
      const elapsed = Date.now() - Number(loginTime);
      const remaining = SESSION_DURATION - elapsed;
      if (remaining > 0) {
        const timer = setTimeout(() => {
          logout();
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}