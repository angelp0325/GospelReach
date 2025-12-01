// This file lists the routes (URLs) that handle user signup and login.

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// When someone signs up, this route runs the registerUser function
router.post("/signup", registerUser);

// When someone logs in, this route runs the loginUser function
router.post("/login", loginUser);

export default router;
