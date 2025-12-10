// Routes for fetching categories and posts filtered by category.

import express from "express";
import {
  getAllCategories,
  getPostsByCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Get all available categories
router.get("/", getAllCategories);

// Get posts for a specific category
router.get("/:name", getPostsByCategory);

export default router;
