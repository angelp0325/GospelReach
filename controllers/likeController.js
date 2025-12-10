// Manages what happens when users like or unlike posts.

import { toggleLike, countLikes, userLikedPost } from "../models/Like.js";

// Toggle like/unlike
export const toggleLikeController = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await toggleLike(req.user.id, postId);
    const totalLikes = await countLikes(postId);
    res.json({ liked: result.liked, totalLikes });
  } catch (err) {
    console.error("Error toggling like:", err.message);
    res.status(500).json({ message: "Server error toggling like." });
  }
};

// Get likes count for a post
export const getLikesController = async (req, res) => {
  const { postId } = req.params;

  try {
    const totalLikes = await countLikes(postId);
    res.json({ postId, totalLikes });
  } catch (err) {
    console.error("Error getting likes:", err.message);
    res.status(500).json({ message: "Server error getting likes." });
  }
};

// Check if user liked a specific post
export const userLikedController = async (req, res) => {
  const { postId } = req.params;

  try {
    const liked = await userLikedPost(req.user.id, postId);
    res.json({ postId, liked });
  } catch (err) {
    console.error("Error checking user like:", err.message);
    res.status(500).json({ message: "Server error checking user like." });
  }
};
