// This file connects my app to the PostgreSQL database.
// It uses the "pg" library and reads the connection info from the .env file.

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Create a pool to connect to PostgreSQL.
// A pool lets the app handle many users at once without crashing.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// This runs when the database connection works.
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

export default pool;
