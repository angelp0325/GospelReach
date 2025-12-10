// models/Post.js
// This file talks directly to the "posts" table in the database.
// It handles adding, editing, deleting, and fetching posts.

const pool = require("../config/db.js");

// Create a new post
async function createPost(userId, title, content, category) {
  const result = await pool.query(
    `INSERT INTO posts (user_id, title, content, category)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, title, content, category]
  );
  return result.rows[0];
}

// Get all posts (sorted newest first)
async function getAllPosts() {
  const result = await pool.query(
    `SELECT posts.*, users.name AS author_name
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`
  );
  return result.rows;
}

// Get one post by ID
async function getPostById(id) {
  const result = await pool.query(
    `SELECT posts.*, users.name AS author_name
     FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.id = $1`,
    [id]
  );
  return result.rows[0];
}

// Update a post (only if it belongs to the user)
async function updatePost(postId, userId, title, content, category) {
  const result = await pool.query(
    `UPDATE posts
     SET title = $1, content = $2, category = $3
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [title, content, category, postId, userId]
  );
  return result.rows[0];
}

// Delete a post (only if it belongs to the user)
async function deletePost(postId, userId) {
  const result = await pool.query(
    `DELETE FROM posts
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [postId, userId]
  );
  return result.rows[0];
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
