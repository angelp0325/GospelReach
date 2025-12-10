// Handles showing available categories and posts by category.

import pool from "../config/db.js";

// Get all categories from the new categories table
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT name FROM categories ORDER BY name ASC`
    );
    const categories = result.rows.map((row) => row.name);
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    res.status(500).json({ message: "Server error fetching categories." });
  }
};

// Get posts by a specific category
export const getPostsByCategory = async (req, res) => {
  const { name } = req.params;

  try {
    const result = await pool.query(
      `SELECT posts.*, users.name AS author_name
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE LOWER(posts.category) = LOWER($1)
       ORDER BY posts.created_at DESC`,
      [name]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts by category:", err.message);
    res
      .status(500)
      .json({ message: "Server error fetching posts by category." });
  }
};
