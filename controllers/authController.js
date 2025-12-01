// This file controls what happens when someone signs up or logs in.
// It checks user info, talks to the database, and returns a token if everything’s okay.

import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// SIGN UP a new user
// 1. Check that all info is filled in
// 2. Make sure the email isn’t already used
// 3. Hash (hide) the password before saving it
// 4. Save the user in the database
// 5. Send back a token so they stay logged in
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser(name, email, hashedPassword);
    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("Error in registerUser:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LOG IN an existing user
// 1. Find the user by email
// 2. Check if the password matches
// 3. If it’s good, send back their info and a token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("Error in loginUser:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
