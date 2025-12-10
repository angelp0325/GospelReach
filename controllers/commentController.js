// Controls what happens when someone interacts with comments on a post.

import {
  createComment,
  getCommentsByPostId,
  deleteComment,
} from "../models/Comment.js";

// ADD a comment
export const addCommentController = async (req, res) => {
  const { postId, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment cannot be empty." });
  }

  try {
    const newComment = await createComment(postId, req.user.id, content);
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Server error adding comment." });
  }
};

// GET all comments for a post
export const getCommentsController = async (req, res) => {
  try {
    const comments = await getCommentsByPostId(req.params.postId);
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ message: "Server error fetching comments." });
  }
};

// DELETE a comment
export const deleteCommentController = async (req, res) => {
  try {
    const deletedComment = await deleteComment(
      req.params.commentId,
      req.user.id
    );
    if (!deletedComment) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments." });
    }
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ message: "Server error deleting comment." });
  }
};
