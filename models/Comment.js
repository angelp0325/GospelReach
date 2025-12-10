// Handles all direct database work related to comments.

import pool from "../config/db.js";

// Add a new comment
export const createComment = async (postId, userId, content) => {
  const result = await pool.query(
    `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, post_id, user_id, content, created_at`,
    [postId, userId, content]
  );
  return result.rows[0];
};

// Get all comments for a specific post
export const getCommentsByPostId = async (postId) => {
  const result = await pool.query(
    `SELECT comments.*, users.name AS author_name
     FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE comments.post_id = $1
     ORDER BY comments.created_at ASC`,
    [postId]
  );
  return result.rows;
};

// Delete a comment (only by its owner)
export const deleteComment = async (commentId, userId) => {
  const result = await pool.query(
    `DELETE FROM comments
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [commentId, userId]
  );
  return result.rows[0];
};
