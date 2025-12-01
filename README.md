# 🕊️ GospelReach — Authentication Core Feature (Full Demo)

## Overview

**GospelReach** is a web app that helps evangelists, pastors, and believers connect and share their faith online.  
This part of the project is the **User Authentication Core Feature**, where users can:

- Sign up for an account
- Log in securely
- Stay logged in using JSON Web Tokens (JWTs)
- Verify their session automatically in the browser

This demo includes a simple **frontend (HTML/CSS/JS)** connected to an **Express + PostgreSQL backend**, showing how authentication works in real time.

---

## Goal

The goal of this feature is to build a **secure and functional login system** that meets the Capstone’s “core feature” requirement.

It demonstrates:

- Secure password handling (bcrypt)
- Token-based authentication (JWT)
- A clean PostgreSQL + Express structure
- A basic frontend to visualize login flow

---

## Core Features

**Sign Up:** Create an account with a name, email, and password  
 **Log In:** Validate credentials and receive a JWT token  
 **Stay Logged In:** Tokens are stored in browser localStorage  
 **Verify Session:** Automatically checks if the token is valid  
 **Frontend Demo:** Built-in webpage for quick testing

---

## Tech Stack

| Area               | Tool              |
| ------------------ | ----------------- |
| Backend            | Node.js + Express |
| Database           | PostgreSQL        |
| Authentication     | bcrypt + JWT      |
| Environment Config | dotenv            |
| Frontend           | HTML + CSS + JS   |

---

## How It Works

1. The user signs up → their password is **hashed** before being saved.
2. The user logs in → the server checks their password using bcrypt.
3. If valid → a **JWT token** is generated and sent back.
4. The frontend stores the token in **localStorage**.
5. The token is used to verify login status through `/auth/me`.

---

## roject Details

<details>
  <summary>Click to view Folder Structure</summary>

```bash
gospelreach/
├── config/
│   └── db.js               # Connects to PostgreSQL
├── controllers/
│   └── authController.js   # Handles signup/login logic
├── middleware/
│   └── authMiddleware.js   # Protects routes, checks JWT
├── models/
│   └── User.js             # User model — interacts with DB
├── routes/
│   └── authRoutes.js       # API routes for authentication
├── utils/
│   └── generateToken.js    # Generates JWT tokens
├── public/
│   ├── index.html          # Frontend for testing auth
│   ├── style.css           # Styles the demo page
│   └── script.js           # Handles frontend logic
├── server.js               # Express server entry point
├── .env                    # Environment variables
└── README.md               # Documentation
```
