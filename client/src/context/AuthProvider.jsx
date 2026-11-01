import { useCallback, useEffect, useMemo, useState } from "react";
import { apiBase } from "../utils/api";
import { AuthContext } from "./AuthContext";

const tokenKey = "deviltutorToken";

async function authRequest(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || data.error || "The request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const saveSession = useCallback((data) => {
    localStorage.setItem(tokenKey, data.token);
    setToken(data.token);
    setUser(data.user);
    setShowAuth(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(tokenKey);
    setToken("");
    setUser(null);
  }, []);

  const openAuth = useCallback((mode = "login") => {
    setAuthMode(mode);
    setShowAuth(true);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authRequest("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(data);
    return data;
  }, [saveSession]);

  const register = useCallback(async (name, email, password) => {
    const data = await authRequest("/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    saveSession(data);
    return data;
  }, [saveSession]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    authRequest("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, logout]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      openAuth("login");
    };
    window.addEventListener("deviltutor:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("deviltutor:unauthorized", handleUnauthorized);
  }, [logout, openAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      showAuth,
      authMode,
      setShowAuth,
      setAuthMode,
      openAuth,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, loading, showAuth, authMode, openAuth, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
