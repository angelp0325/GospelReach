// This is the navigation bar shown at the top of every page.
// It changes between "Log In" and "Log Out" depending on whether a user is logged in.

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // When the page loads, check if a JWT token is saved
  useEffect(() => {
    // Function that checks if a token exists
    const checkToken = () => {
      const token = localStorage.getItem("jwtToken");
      setIsLoggedIn(!!token);
    };

    // Check immediately on load
    checkToken();

    // Listen for changes to localStorage (login/logout across app)
    window.addEventListener("storage", checkToken);
    window.addEventListener("authChange", checkToken); // custom event

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("authChange", checkToken);
    };
  }, []);

  // Handle login/logout button click
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Log the user out
      localStorage.removeItem("jwtToken");
      setIsLoggedIn(false);
      navigate("/"); // back to Auth page
    } else {
      // Go to login page
      navigate("/");
    }
  };

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#007bff",
        padding: "1em",
        color: "white",
      }}
    >
      {/* Left side: Brand / Home link */}
      <h2 style={{ margin: 0 }}>
        <Link
          to="/posts"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🕊️ GospelReach
        </Link>
      </h2>

      {/* Right side: Login/Logout button */}
      <div>
        <button
          onClick={handleAuthClick}
          style={{
            background: "#003366",
            border: "none",
            color: "white",
            padding: "0.5em 1em",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isLoggedIn ? "Log Out" : "Log In"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
