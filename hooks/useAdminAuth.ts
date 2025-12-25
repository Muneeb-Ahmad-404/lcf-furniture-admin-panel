"use client";
import { useState, useEffect } from "react";

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (storedToken) {
      setToken(storedToken);
      // Optionally decode token to get admin info
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setAdmin({ email: payload.email || "admin" });
      } catch {}
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("admin_token", newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split(".")[1]));
      setAdmin({ email: payload.email || "admin" });
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setAdmin(null);
  };

  return { token, admin, login, logout, isAuthenticated: !!admin };
}
