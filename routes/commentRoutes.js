// Defines all routes (URLs) related to comments.

import express from "express";
import {
  addCommentController,
  getCommentsController,
  deleteCommentController,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Anyone can view comments
router.get("/:postId", getCommentsController);

// Only logged-in users can add or delete their own comments
router.post("/", protect, addCommentController);
router.delete("/:commentId", protect, deleteCommentController);

export default router;
