// This file protects routes that only logged-in users should see.
// It checks for a valid token before letting users through.

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../models/User.js";

dotenv.config();

// Check if the request has a valid token before moving forward.
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // The token should be in the form: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Check if the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look up the user the token belongs to
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Save user info to request for later use
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
