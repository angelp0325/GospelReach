// routes/postRoutes.js
// This file defines all the URLs for post actions (Create, Read, Update, Delete)

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController.js");

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes (user must be logged in)
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
