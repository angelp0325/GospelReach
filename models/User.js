// This file handles all the direct work with the database for users.
// It’s like a helper that talks to the "users" table.

import pool from "../config/db.js";

// Add a new user to the database.
export const createUser = async (name, email, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, passwordHash]
  );
  return result.rows[0];
};

// Find a user by their email. Used to check if someone already signed up or wants to log in.
export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

// Find a user by their ID. Used to confirm someone is logged in.
export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};
