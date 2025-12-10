// This script seeds default GospelReach categories into the database.

import pool from "./db.js";

const defaultCategories = [
  "Theology",
  "Evangelism",
  "Apologetics",
  "Christian Living",
  "Church History",
  "Prayer",
  "Discipleship",
];

async function seedCategories() {
  try {
    console.log("Seeding default categories...");

    // Create a dedicated "categories" table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    // Insert categories if they don't already exist
    for (const cat of defaultCategories) {
      await pool.query(
        `INSERT INTO categories (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING;`,
        [cat]
      );
    }

    console.log("Categories seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
}

seedCategories();
