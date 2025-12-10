const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const postsContainer = document.getElementById("postsContainer");
const token = localStorage.getItem("jwtToken");
const API_URL = window.location.origin;

let editPostId = null;

// Fetch and display all posts (with comments + likes)
async function fetchPosts() {
  postsContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();

    if (!posts.length) {
      postsContainer.innerHTML = "<p>No posts yet. Be the first to share!</p>";
      return;
    }

    // Render posts with like + comment sections
    postsContainer.innerHTML = posts
      .map((post) => {
        const userId = getUserIdFromToken(token);
        const isOwner = userId && userId === post.user_id;

        return `
        <div class="post-card">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p><strong>Category:</strong> ${post.category || "Uncategorized"}</p>
          <p class="post-meta">By ${post.author_name} • ${new Date(
          post.created_at
        ).toLocaleString()}</p>

          <!-- ✅ Like Section -->
          <div class="likes-section">
            <button id="likeBtn-${post.id}" onclick="toggleLike(${post.id})">
              ❤️ Like
            </button>
            <span id="likeCount-${post.id}">0 likes</span>
          </div>

          <!-- Owner-only edit/delete buttons -->
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
              })">Delete</button>
            `
              : ""
          }

          <!-- Comments Section -->
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

    // After posts load, fetch comments + likes for each
    posts.forEach((post) => {
      fetchComments(post.id);
      loadLikeStatus(post.id);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
    postsContainer.innerHTML = "<p>Error loading posts.</p>";
  }
}

// Fetch comments for a specific post
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

// Add a new comment
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

// Helpers
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

// Fetch likes count and whether the current user liked the post
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

// Handle like/unlike click
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

// Load everything
fetchPosts();
