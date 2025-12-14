// This file lists all routes (URLs) for the post system.

import express from "express";
import {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
} from "../controllers/postController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes — anyone can view posts
// Updated: optionalAuth allows backend to identify user (for user_liked)
router.get("/", optionalAuth, getAllPostsController);
router.get("/:id", getPostByIdController);

// Protected routes — only logged-in users can modify posts
router.post("/", protect, createPostController);
router.put("/:id", protect, updatePostController);
router.delete("/:id", protect, deletePostController);

export default router;
