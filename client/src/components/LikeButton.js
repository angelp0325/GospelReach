// This component shows the like/unlike button for a post.
// It also displays how many likes the post has.

import React, { useState, useEffect } from "react";
import api from "../api/api";

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  // Load like info when component mounts
  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      const countRes = await api.get(`/likes/${postId}/count`);
      setCount(countRes.data.totalLikes);

      const statusRes = await api.get(`/likes/${postId}/status`);
      setLiked(statusRes.data.liked);
    } catch (err) {
      console.error("Error fetching like status:", err);
    }
  };

  const toggleLike = async () => {
    try {
      const res = await api.post(`/likes/${postId}`);
      setLiked(res.data.liked);
      setCount(res.data.totalLikes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <div style={{ marginTop: "1em" }}>
      <button onClick={toggleLike}>{liked ? "💔 Unlike" : "❤️ Like"}</button>
      <span style={{ marginLeft: "0.5em" }}>
        {count} like{count === 1 ? "" : "s"}
      </span>
    </div>
  );
};

export default LikeButton;
