// This file controls which page the user sees based on the route.
// Navbar is visible on all pages but we now protect certain routes.

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import PostsPage from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/posts" element={<PostsPage />} />
        {/* Protected route for logged-in users only */}
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
