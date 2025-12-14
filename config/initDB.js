// This file initializes the database tables if they don't exist.

import pool from "./db.js";

async function initDB() {
  try {
    console.log("Setting up GospelReach database...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        UNIQUE(user_id, post_id)
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    console.log("✅ Tables created or already exist!");

    // Optional: Seed categories
    await pool.query(`
      INSERT INTO categories (name)
      VALUES 
        ('Theology'),
        ('Evangelism'),
        ('Apologetics'),
        ('Christian Living'),
        ('Church History'),
        ('Prayer'),
        ('Discipleship')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log("🌱 Categories seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
}

initDB();
