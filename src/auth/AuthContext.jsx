/**
 * AuthContext manages the user's authentication state by storing a token,
 * It provides functions for the user to register, log in, and log out,
 * all of which update the token in state.
 */

import { createContext, useContext, useState } from "react";

// import.meta.env allows us to access environment variables,
// which are defined in a file named .env

const API = import.meta.env.VITE_API;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const register = async ({ username, password }) => {
    const response = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    setToken(result.token);
    localStorage.setItem("token", result.token);
  };

  const login = async ({ username, password }) => {
    const response = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    setToken(result.token);
    localStorage.setItem("token", result.token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
