// This component displays a single post.
// It shows the title, content, category, likes, and comments.

import React, { useState, useEffect } from "react";
import api from "../api/api";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentsSection";

const PostCard = ({ post, user, onEdit, onDelete }) => {
  const [comments, setComments] = useState([]);

  // Load comments for each post when it's shown
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${post.id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const handleAddComment = async (content) => {
    try {
      await api.post("/comments", { postId: post.id, content });
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>
        <strong>Category:</strong> {post.category || "Uncategorized"}
      </p>
      <p className="post-meta">
        By {post.author_name} • {new Date(post.created_at).toLocaleString()}
      </p>

      {/* Show edit/delete buttons only for the post owner */}
      {user?.id === post.user_id && (
        <div>
          <button onClick={() => onEdit(post)}>✏️ Edit</button>
          <button
            onClick={() => onDelete(post.id)}
            style={{ background: "#999", marginLeft: "0.5em" }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Like Button */}
      <LikeButton postId={post.id} />

      {/* Comments */}
      <CommentSection
        comments={comments}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        canComment={!!user}
        userId={user?.id}
      />
    </div>
  );
};

export default PostCard;
