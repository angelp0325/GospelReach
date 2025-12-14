// This file talks to the "posts" table in the database.
// It helps us create, read, update, and delete posts (CRUD).

import pool from "../config/db.js";

// CREATE a new post
export const createPost = async (userId, title, content, category) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, title, content, category)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, title, content, category, created_at`,
    [userId, title, content, category]
  );
  return result.rows[0];
};

// GET all posts (show latest first)
export const getAllPosts = async () => {
  const result = await pool.query(`
    SELECT 
      posts.*, 
      users.name AS author_name,
      COALESCE(COUNT(likes.id), 0) AS total_likes
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id, users.name
    ORDER BY posts.created_at DESC
  `);
  return result.rows;
};

// GET a single post by ID
export const getPostById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      posts.*, 
      users.name AS author_name,
      COALESCE(COUNT(likes.id), 0) AS total_likes
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.id = $1
    GROUP BY posts.id, users.name
    `,
    [id]
  );
  return result.rows[0];
};

// UPDATE a post (only if it belongs to the current user)
export const updatePost = async (postId, userId, title, content, category) => {
  const result = await pool.query(
    `UPDATE posts
     SET title = $1, content = $2, category = $3
     WHERE id = $4 AND user_id = $5
     RETURNING id, title, content, category, created_at`,
    [title, content, category, postId, userId]
  );
  return result.rows[0];
};

// DELETE a post (only if it belongs to the current user)
export const deletePost = async (postId, userId) => {
  const result = await pool.query(
    `DELETE FROM posts
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [postId, userId]
  );
  return result.rows[0];
};
