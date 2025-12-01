// This file makes a JWT (token) when someone logs in or signs up.
// The token helps keep users logged in safely.

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Make a token that lasts for 1 day.
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
