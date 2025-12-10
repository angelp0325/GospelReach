// This file controls what happens when someone creates, edits, or views posts.
// It connects user actions (routes) with the database helpers (models).

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../models/Post.js";

// CREATE a new post
export const createPostController = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
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
export const getAllPostsController = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getAllPostsController:", err.message);
    res.status(500).json({ message: "Server error while getting posts." });
  }
};

// GET one post by ID
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
export const updatePostController = async (req, res) => {
  const { title, content, category } = req.body;

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
