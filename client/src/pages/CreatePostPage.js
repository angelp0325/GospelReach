// This page lets users create a new post or edit an existing one.

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

function CreatePostPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwtToken");

  // Detect if we're editing (data passed from PostsPage)
  useEffect(() => {
    const postToEdit = location.state?.postToEdit;

    if (postToEdit) {
      console.log("Editing post:", postToEdit);
      setIsEditing(true);
      setForm({
        title: postToEdit.title || "",
        content: postToEdit.content || "",
        category: postToEdit.category || "",
      });
    } else {
      console.log("No postToEdit found — creating new post.");
      setIsEditing(false);
    }

    setLoading(false);
  }, [location.state]);

  // Load categories from backend
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.category) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (isEditing && location.state?.postToEdit) {
        await api.put(`/posts/${location.state.postToEdit.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post updated successfully!");
      } else {
        await api.post("/posts", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post created successfully!");
      }

      navigate("/posts");
    } catch (err) {
      console.error("Error saving post:", err);
      alert("There was a problem saving your post.");
    }
  };

  const handleCancel = () => navigate("/posts");

  // Prevent blank screen while checking state
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "3em" }}>
        <h3>Loading form...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f7f9fc",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2em",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "500px",
        }}
      >
        <h2>{isEditing ? "Edit Post" : "Create a New Post"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "1em", padding: "0.5em" }}
          />

          {/* Content */}
          <textarea
            name="content"
            placeholder="Write your devotional or sermon..."
            value={form.content}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginBottom: "1em",
              padding: "0.5em",
              minHeight: "120px",
            }}
          />

          {/* Category */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "1em", padding: "0.5em" }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <button
            type="submit"
            style={{
              backgroundColor: "#003366",
              color: "white",
              padding: "0.6em 1em",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "0.5em",
            }}
          >
            {isEditing ? "Update Post" : "Create Post"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "#999",
              color: "white",
              padding: "0.6em 1em",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
