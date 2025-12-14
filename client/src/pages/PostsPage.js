// This page shows all user posts in the GospelReach community.
// It lets users like/unlike posts, filter by category, and add comments.
// Logged-in users can also edit or delete their own posts.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import CommentsSection from "../components/CommentsSection";

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");

  // Decode user ID from token (so we know who owns which post)
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [token]);

  // Fetch posts and categories
  useEffect(() => {
    async function fetchAllData() {
      try {
        const endpoint =
          selectedCategory === "all"
            ? "/posts"
            : `/categories/${selectedCategory}`;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get(endpoint, { headers });
        setPosts(res.data);

        const catRes = await api.get("/categories");
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error fetching posts or categories:", err);
      }
    }

    fetchAllData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchAllData, 15000);
    return () => clearInterval(interval);
  }, [selectedCategory, token]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  async function handleDelete(postId) {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  }

  // ❤️ Like / Unlike Handler (with visual state + disable for guests)
  async function handleLike(postId) {
    if (!token) return; // ignore if logged out
    try {
      // Instantly toggle like visually
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                user_liked: !p.user_liked,
                total_likes: p.user_liked
                  ? Math.max(p.total_likes - 1, 0)
                  : (p.total_likes || 0) + 1,
              }
            : p
        )
      );

      // Sync with backend
      const res = await api.post(
        `/likes/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ensure frontend matches backend count and state
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                user_liked: res.data.liked,
                total_likes: res.data.totalLikes,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1em" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#007bff",
          color: "white",
          padding: "1em",
          borderRadius: "8px",
        }}
      >
        <h2>🕊️ GospelReach — Community Feed</h2>

        {token && (
          <button
            onClick={() => navigate("/create-post")}
            style={{
              backgroundColor: "#003366",
              color: "white",
              border: "none",
              padding: "0.5em 1em",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ✍️ Create New Post
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ marginTop: "1em" }}>
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{
            marginLeft: "0.5em",
            padding: "0.5em",
            borderRadius: "5px",
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Posts List */}
      <div style={{ marginTop: "2em" }}>
        {posts.length === 0 ? (
          <p>No posts available yet. Be the first to share!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1em",
                marginBottom: "1em",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <p>
                <em>Category: {post.category}</em>
              </p>
              <p style={{ fontSize: "0.9em", color: "gray" }}>
                By {post.author_name} •{" "}
                {new Date(post.created_at).toLocaleString()}
              </p>

              {/* ❤️ Like / Edit / Delete buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                  flexWrap: "wrap",
                }}
              >
                {/* ❤️ Like Button (disabled for guests) */}
                <button
                  onClick={() => handleLike(post.id)}
                  disabled={!token}
                  title={!token ? "Log in to like posts" : ""}
                  style={{
                    backgroundColor: post.user_liked ? "#dc3545" : "white",
                    color: post.user_liked ? "white" : "#dc3545",
                    border: "2px solid #dc3545",
                    padding: "0.4em 0.8em",
                    borderRadius: "6px",
                    cursor: token ? "pointer" : "not-allowed",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    opacity: token ? 1 : 0.6,
                  }}
                >
                  ❤️ {post.user_liked ? "Liked" : "Like"} (
                  {post.total_likes || 0})
                </button>

                {/* Edit/Delete only for post owner */}
                {userId === post.user_id && (
                  <>
                    <button
                      onClick={() =>
                        navigate("/create-post", {
                          state: { postToEdit: post },
                        })
                      }
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "0.3em 0.7em",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "0.3em 0.7em",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>

              {/* 💬 Comments Section */}
              <CommentsSection postId={post.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostsPage;
