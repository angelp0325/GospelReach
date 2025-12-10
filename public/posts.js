// This file handles everything on the posts page:
// viewing, creating, editing, and deleting posts.

const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const postsContainer = document.getElementById("postsContainer");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

// Token from login (saved in localStorage)
const token = localStorage.getItem("jwtToken");

// Base API URL
const API_URL = window.location.origin;

// Keeps track of which post we're editing (null means we're creating a new one)
let editPostId = null;

// Fetch and display all posts
async function fetchPosts() {
  postsContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();

    if (!posts.length) {
      postsContainer.innerHTML = "<p>No posts yet. Be the first to share!</p>";
      return;
    }

    postsContainer.innerHTML = posts
      .map((post) => {
        const userId = getUserIdFromToken(token);
        const isOwner = userId && userId === post.user_id;

        return `
          <div class="post-card">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><strong>Category:</strong> ${
              post.category || "Uncategorized"
            }</p>
            <p class="post-meta">By ${post.author_name} • ${new Date(
          post.created_at
        ).toLocaleString()}</p>

            ${
              isOwner
                ? `
                  <button class="edit-btn" onclick="editPost(${
                    post.id
                  }, '${escapeText(post.title)}', '${escapeText(
                    post.content
                  )}', '${escapeText(post.category || "")}')">✏️ Edit</button>
                  <button class="delete-btn" onclick="deletePost(${
                    post.id
                  })"> Delete</button>
                `
                : ""
            }
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading posts:", error);
    postsContainer.innerHTML = "<p>Error loading posts.</p>";
  }
}

// Helper: Decode the token to get user ID
function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

// Escape text for safe HTML rendering
function escapeText(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// Handle create OR update post
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!token) {
    postMessage.textContent = "You must be logged in to create or edit posts.";
    return;
  }

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const category = document.getElementById("category").value.trim();

  const method = editPostId ? "PUT" : "POST";
  const endpoint = editPostId
    ? `${API_URL}/posts/${editPostId}`
    : `${API_URL}/posts`;

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, category }),
    });

    const data = await response.json();

    if (response.ok) {
      postMessage.textContent = editPostId
        ? " Post updated successfully!"
        : " Post created successfully!";
      postForm.reset();
      exitEditMode();
      fetchPosts();
    } else {
      postMessage.textContent = data.message || "Error saving post.";
    }
  } catch (error) {
    console.error("Error saving post:", error);
    postMessage.textContent = "Error saving post.";
  }
});

// Enable Edit Mode for a post
function editPost(id, title, content, category) {
  editPostId = id;
  document.getElementById("title").value = title;
  document.getElementById("content").value = content;
  document.getElementById("category").value = category;
  formTitle.textContent = "Edit Post";
  submitBtn.textContent = "Update Post";
  cancelEditBtn.style.display = "inline-block";
  postMessage.textContent = "Editing your post...";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancel Edit Mode
cancelEditBtn.addEventListener("click", () => {
  exitEditMode();
});

// Exit edit mode and reset form
function exitEditMode() {
  editPostId = null;
  formTitle.textContent = "Create a New Post";
  submitBtn.textContent = "Create Post";
  cancelEditBtn.style.display = "none";
  postForm.reset();
  postMessage.textContent = "";
}

// Delete a post
async function deletePost(id) {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      alert("🗑️ Post deleted successfully!");
      fetchPosts();
    } else {
      alert(data.message || "Error deleting post.");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

// Load all posts when the page opens
fetchPosts();
