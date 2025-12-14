// This component shows and manages comments under each post.
// Users can read comments, add new ones, and delete their own.

import React, { useEffect, useState } from "react";
import api from "../api/api";

function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("jwtToken");

  // Load all comments for this post
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await api.get(`/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }

    fetchComments();
  }, [postId]);

  // Get all comments for a post from the backend
  async function fetchComments() {
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }

  // Add a new comment
  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(
        "/comments",
        { postId, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewComment(""); // Clear input
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  }

  // Delete a comment
  async function handleDeleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  }

  // Get current logged-in user's ID from the JWT token
  function getUserIdFromToken() {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  const currentUserId = getUserIdFromToken();

  return (
    <div style={{ marginTop: "1em" }}>
      <h5>💬 Comments</h5>

      {/* Show list of comments */}
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#f9f9f9",
              padding: "0.5em",
              marginBottom: "0.5em",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>{c.author_name}:</strong> {c.content}
            </p>
            <p style={{ fontSize: "0.8em", color: "gray" }}>
              {new Date(c.created_at).toLocaleString()}
            </p>

            {currentUserId === c.user_id && (
              <button
                onClick={() => handleDeleteComment(c.id)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  padding: "0.2em 0.5em",
                  cursor: "pointer",
                  fontSize: "0.8em",
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}

      {/* Add new comment */}
      {token ? (
        <form onSubmit={handleAddComment} style={{ marginTop: "1em" }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{
              width: "80%",
              padding: "0.5em",
              marginRight: "0.5em",
            }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#003366",
              color: "white",
              border: "none",
              padding: "0.5em 1em",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Post
          </button>
        </form>
      ) : (
        <p style={{ color: "gray" }}>
          <em>Login to add a comment.</em>
        </p>
      )}
    </div>
  );
}

export default CommentsSection;
