// This component protects pages that should only be seen by logged-in users.
// If the user doesn't have a valid token, we send them back to the login page.

import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwtToken");

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the protected content
  return children;
}

export default ProtectedRoute;
