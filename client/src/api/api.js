// This file helps connect the React app to the backend API.
// It uses Axios to send requests (like login, register, get posts, etc.)
// and includes the token if the user is logged in.

import axios from "axios";

// Create an Axios instance that connects to the Express backend.
// Thanks to "proxy" in package.json, it points to http://localhost:5000 automatically.
const api = axios.create({
  baseURL: "/", // relative to the React proxy
});

// This function automatically adds the user's token to requests if available.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
