// posts.js
// This handles creating, editing, deleting, liking, commenting, and filtering posts in GospelReach.

const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const postsContainer = document.getElementById("postsContainer");
const categorySelect = document.getElementById("categorySelect");
const token = localStorage.getItem("jwtToken");
const API_URL = window.location.origin;

let editPostId = null;

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const category = document.getElementById("category").value.trim();

  if (!title || !content || !category) {
    postMessage.textContent = "Please fill in all fields.";
    postMessage.style.color = "red";
    return;
  }

  try {
    const endpoint = editPostId
      ? `${API_URL}/posts/${editPostId}`
      : `${API_URL}/posts`;
    const method = editPostId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, category }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to save post.");
    }

    const data = await res.json();
    postMessage.textContent = editPostId
      ? "✅ Post updated successfully!"
      : "✅ Post created successfully!";
    postMessage.style.color = "green";

    // Reset form
    postForm.reset();
    editPostId = null;
    document.getElementById("formTitle").textContent = "Create a New Post";
    document.getElementById("submitBtn").textContent = "Create Post";
    document.getElementById("cancelEditBtn").style.display = "none";

    // Reset category filter and reload posts
    document.getElementById("categorySelect").value = "all";
    fetchPosts();
  } catch (err) {
    console.error("Error saving post:", err);
    postMessage.textContent = "❌ Error saving post. Try again.";
    postMessage.style.color = "red";
  }
});

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
          <p><strong>Category:</strong> ${post.category || "Uncategorized"}</p>
          <p class="post-meta">
            By ${post.author_name} • ${new Date(
          post.created_at
        ).toLocaleString()}
          </p>

          <!-- ❤️ Like Section -->
          <div class="likes-section">
            <button id="likeBtn-${post.id}" onclick="toggleLike(${
          post.id
        })">❤️ Like</button>
            <span id="likeCount-${post.id}">0 likes</span>
          </div>

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
              })">🗑️ Delete</button>
            `
              : ""
          }

          <!-- 💬 Comments Section -->
          <div class="comments" id="comments-${post.id}">
            <h4>Comments</h4>
            <div id="commentList-${post.id}"></div>
            ${
              token
                ? `
              <form class="commentForm" onsubmit="addComment(event, ${post.id})">
                <input type="text" id="commentInput-${post.id}" placeholder="Write a comment..." required />
                <button type="submit">Send</button>
              </form>
            `
                : "<p><em>Login to add a comment.</em></p>"
            }
          </div>
        </div>`;
      })
      .join("");

    posts.forEach((post) => {
      fetchComments(post.id);
      loadLikeStatus(post.id);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
    postsContainer.innerHTML = "<p>Error loading posts.</p>";
  }
}

function editPost(id, title, content, category) {
  document.getElementById("title").value = title;
  document.getElementById("content").value = content;
  document.getElementById("category").value = category;
  document.getElementById("formTitle").textContent = "Edit Post";
  document.getElementById("submitBtn").textContent = "Update Post";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
  editPostId = id;
}

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  editPostId = null;
  postForm.reset();
  document.getElementById("formTitle").textContent = "Create a New Post";
  document.getElementById("submitBtn").textContent = "Create Post";
  document.getElementById("cancelEditBtn").style.display = "none";
});

// Delete Post
async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchPosts();
    }
  } catch (err) {
    console.error("Error deleting post:", err);
  }
}

async function fetchComments(postId) {
  try {
    const res = await fetch(`${API_URL}/comments/${postId}`);
    const comments = await res.json();
    const container = document.getElementById(`commentList-${postId}`);

    if (!comments.length) {
      container.innerHTML = "<p>No comments yet.</p>";
      return;
    }

    container.innerHTML = comments
      .map((c) => {
        const userId = getUserIdFromToken(token);
        const isOwner = userId && userId === c.user_id;
        return `
          <div class="comment">
            <p><strong>${c.author_name}:</strong> ${c.content}</p>
            <p class="comment-meta">${new Date(
              c.created_at
            ).toLocaleString()}</p>
            ${
              isOwner
                ? `<button class="delete-comment-btn" onclick="deleteComment(${c.id}, ${postId})">Delete</button>`
                : ""
            }
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

// Add a comment
async function addComment(event, postId) {
  event.preventDefault();
  const input = document.getElementById(`commentInput-${postId}`);
  const content = input.value.trim();
  if (!content) return;

  try {
    const res = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, content }),
    });

    if (res.ok) {
      input.value = "";
      fetchComments(postId);
    }
  } catch (err) {
    console.error("Error adding comment:", err);
  }
}

// Delete a comment
async function deleteComment(commentId, postId) {
  if (!confirm("Delete this comment?")) return;

  try {
    const res = await fetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchComments(postId);
  } catch (err) {
    console.error("Error deleting comment:", err);
  }
}

async function loadLikeStatus(postId) {
  const countRes = await fetch(`${API_URL}/likes/${postId}/count`);
  const { totalLikes } = await countRes.json();

  let liked = false;
  if (token) {
    const likedRes = await fetch(`${API_URL}/likes/${postId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const likedData = await likedRes.json();
    liked = likedData.liked;
  }

  const likeBtn = document.getElementById(`likeBtn-${postId}`);
  const likeCount = document.getElementById(`likeCount-${postId}`);

  if (likeBtn && likeCount) {
    likeBtn.textContent = liked ? "💔 Unlike" : "❤️ Like";
    likeCount.textContent = `${totalLikes} like${totalLikes === 1 ? "" : "s"}`;
  }
}

// Toggle like/unlike
async function toggleLike(postId) {
  if (!token) {
    alert("You must be logged in to like posts.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/likes/${postId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const likeBtn = document.getElementById(`likeBtn-${postId}`);
    const likeCount = document.getElementById(`likeCount-${postId}`);

    if (likeBtn && likeCount) {
      likeBtn.textContent = data.liked ? "💔 Unlike" : "❤️ Like";
      likeCount.textContent = `${data.totalLikes} like${
        data.totalLikes === 1 ? "" : "s"
      }`;
    }
  } catch (err) {
    console.error("Error toggling like:", err);
  }
}

async function loadCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`);
    const categories = await res.json();

    if (categories.length > 0) {
      // Load into filter
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });

      // Load into create post form
      const createCategorySelect = document.getElementById("category");
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        createCategorySelect.appendChild(option);
      });
    }
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

async function filterByCategory() {
  const selected = categorySelect.value;

  if (selected === "all") {
    fetchPosts();
    return;
  }

  postsContainer.innerHTML = `<p>Loading posts in ${selected}...</p>`;

  try {
    const res = await fetch(`${API_URL}/categories/${selected}`);
    const posts = await res.json();

    if (!posts.length) {
      postsContainer.innerHTML = `<p>No posts found in "${selected}".</p>`;
      return;
    }

    postsContainer.innerHTML = posts
      .map(
        (post) => `
        <div class="post-card">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p><strong>Category:</strong> ${post.category}</p>
          <p class="post-meta">By ${post.author_name} • ${new Date(
          post.created_at
        ).toLocaleString()}</p>

          <div class="likes-section">
            <button id="likeBtn-${post.id}" onclick="toggleLike(${
          post.id
        })">❤️ Like</button>
            <span id="likeCount-${post.id}">0 likes</span>
          </div>

          <div class="comments" id="comments-${post.id}">
            <h4>Comments</h4>
            <div id="commentList-${post.id}"></div>
          </div>
        </div>`
      )
      .join("");

    posts.forEach((p) => {
      loadLikeStatus(p.id);
      fetchComments(p.id);
    });
  } catch (err) {
    console.error("Error filtering posts:", err);
  }
}

categorySelect.addEventListener("change", filterByCategory);

function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

function escapeText(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// Load everything on page load
loadCategories();
fetchPosts();
