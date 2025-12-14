// This page handles both Login and Signup for users.
// It talks to the backend API and stores a token if login/signup succeeds.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // axios setup file that talks to backend

function AuthPage() {
  // Keeps track of whether we’re in Login or Signup mode
  const [isSignup, setIsSignup] = useState(false);

  // Stores what the user types into each input box
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // For messages like “Invalid credentials” or success
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Runs every time the user types something
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // When the form is submitted (either login or signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignup) {
        // If the user is creating an account
        const res = await api.post("/auth/signup", form);

        // Save the token to localStorage
        localStorage.setItem("jwtToken", res.data.token);

        // Tell other parts of the app (like Navbar) that auth changed
        window.dispatchEvent(new Event("authChange"));

        // Go to the posts page
        navigate("/posts");
      } else {
        // If the user is logging in
        const res = await api.post("/auth/login", form);

        localStorage.setItem("jwtToken", res.data.token);
        window.dispatchEvent(new Event("authChange"));
        navigate("/posts");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setMessage(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  // Switch between login and signup mode
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setMessage("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f7f9fc",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2em",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {isSignup && (
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
              />
            </div>
          )}

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75em",
              backgroundColor: "#003366",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        {message && <p style={{ color: "red", marginTop: "1em" }}>{message}</p>}

        <p style={{ marginTop: "1em" }}>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={toggleMode}
            style={{
              background: "none",
              border: "none",
              color: "#003366",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
