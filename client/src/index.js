// This is the starting point of the React app.
// It renders <App /> inside the browser and wraps everything with the AuthProvider
// so all pages can access the login info.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
