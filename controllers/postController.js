// This file controls what happens when someone interacts with posts.
// It connects routes (URLs) to the database logic from the Post model.

import pool from "../config/db.js";
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "../models/Post.js";

// CREATE a new post
// When a user writes a new devotional or sermon, this saves it to the database.
export const createPostController = async (req, res) => {
  const { title, content, category } = req.body;

  // Check if all required fields are filled out
  if (!title || !content || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newPost = await createPost(req.user.id, title, content, category);
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error in createPostController:", err.message);
    res.status(500).json({ message: "Server error while creating post." });
  }
};

// GET all posts
// Shows all devotionals/sermons, including author names and total likes.
export const getAllPostsController = async (req, res) => {
  // Check if the request includes a logged-in user
  const userId = req.user ? req.user.id : null;

  try {
    // Fetch all posts along with total likes
    const result = await pool.query(`
      SELECT 
        posts.id,
        posts.title,
        posts.content,
        posts.category,
        posts.user_id,
        posts.created_at,
        users.name AS author_name,
        COUNT(likes.id) AS total_likes
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id, users.name
      ORDER BY posts.created_at DESC
    `);

    let posts = result.rows;

    // If user is logged in, fetch which posts they have liked
    if (userId) {
      const liked = await pool.query(
        `SELECT post_id FROM likes WHERE user_id = $1`,
        [userId]
      );

      const likedIds = liked.rows.map((r) => r.post_id);

      // Add "user_liked" property to each post
      posts = posts.map((post) => ({
        ...post,
        user_liked: likedIds.includes(post.id),
      }));
    } else {
      // Not logged in → user_liked always false
      posts = posts.map((post) => ({
        ...post,
        user_liked: false,
      }));
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getAllPostsController:", err.message);
    res.status(500).json({ message: "Server error while getting posts." });
  }
};

// GET one post by ID
// This shows a single devotional/sermon with its details.
export const getPostByIdController = async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error("Error in getPostByIdController:", err.message);
    res.status(500).json({ message: "Server error while getting post." });
  }
};

// UPDATE a post
// Lets a user edit one of their own posts.
export const updatePostController = async (req, res) => {
  const { title, content, category } = req.body;

  // Make sure all fields are filled in
  if (!title || !content || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updatedPost = await updatePost(
      req.params.id,
      req.user.id,
      title,
      content,
      category
    );

    if (!updatedPost) {
      return res
        .status(403)
        .json({ message: "You can only update your own posts." });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error in updatePostController:", err.message);
    res.status(500).json({ message: "Server error while updating post." });
  }
};

// DELETE a post
// Lets a user delete one of their own devotionals/sermons.
export const deletePostController = async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id, req.user.id);

    if (!deletedPost) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error in deletePostController:", err.message);
    res.status(500).json({ message: "Server error while deleting post." });
  }
};
