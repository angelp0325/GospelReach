// controllers/postController.js
// This file handles all post-related logic.
// It connects the requests from routes to the database through Post.js.

const Post = require("../models/Post.js");

// Create a new post
async function createPost(req, res) {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.id; // This comes from the token

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const newPost = await Post.createPost(userId, title, content, category);
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(500).json({ message: "Server error creating post." });
  }
}

// Get all posts
async function getAllPosts(req, res) {
  try {
    const posts = await Post.getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error fetching posts." });
  }
}

// Get a single post
async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.getPostById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err.message);
    res.status(500).json({ message: "Server error fetching post." });
  }
}

// Update a post
async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user.id;

    const updatedPost = await Post.updatePost(
      id,
      userId,
      title,
      content,
      category
    );

    if (!updatedPost) {
      return res
        .status(403)
        .json({ message: "You can only edit your own posts." });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err.message);
    res.status(500).json({ message: "Server error updating post." });
  }
}

// Delete a post
async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedPost = await Post.deletePost(id, userId);

    if (!deletedPost) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res.status(500).json({ message: "Server error deleting post." });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
