// server.js
// Main entry point — this connects everything together.

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const authRoutes = require("./routes/authRoutes.js");
const postRoutes = require("./routes/postRoutes.js");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to GospelReach API!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
