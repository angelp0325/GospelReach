// Defines the API routes for liking and unliking posts.

import express from "express";
import {
  toggleLikeController,
  getLikesController,
  userLikedController,
} from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toggle like/unlike
router.post("/:postId", protect, toggleLikeController);

// Get total likes for a post
router.get("/:postId/count", getLikesController);

// Check if the logged-in user has liked a post
router.get("/:postId/status", protect, userLikedController);

export default router;
