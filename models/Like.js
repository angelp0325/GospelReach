// Handles all database actions related to likes.

import pool from "../config/db.js";

// Toggle like: if liked already then remove, else then add
export const toggleLike = async (userId, postId) => {
  // Check if the like exists
  const existing = await pool.query(
    `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );

  if (existing.rows.length > 0) {
    // Unlike (remove it)
    await pool.query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`, [
      userId,
      postId,
    ]);
    return { liked: false };
  } else {
    // Like (add it)
    await pool.query(`INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`, [
      userId,
      postId,
    ]);
    return { liked: true };
  }
};

// Count total likes for a post
export const countLikes = async (postId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS total FROM likes WHERE post_id = $1`,
    [postId]
  );
  return parseInt(result.rows[0].total);
};

// Check if a specific user has liked a post
export const userLikedPost = async (userId, postId) => {
  const result = await pool.query(
    `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rows.length > 0;
};
