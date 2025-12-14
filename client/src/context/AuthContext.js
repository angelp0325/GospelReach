// This file manages the user's authentication state in React.
// It uses Context so the login info is available across the whole app.

import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // This holds the user info and token.
  const [user, setUser] = useState(null);

  // Check if there's a saved token when the app starts.
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      verifyUser();
    }
  }, []);

  // Sign up a new user.
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      localStorage.setItem("jwtToken", res.data.token);
      setUser(res.data);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  // Log in an existing user.
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("jwtToken", res.data.token);
      setUser(res.data);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Log out the user (just remove the token).
  const logout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
  };

  // Verify if the token is still valid and get the logged-in user's info.
  const verifyUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Token invalid or expired:", err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
