# 🕊️ GospelReach

### _A Christian Community Platform for Sharing Devotionals, Sermons, and Faith Discussions._

GospelReach is a **full-stack + PostgreSQL** web app where users can:

- ✍️ Share devotionals or sermons
- 💬 Comment on posts
- ❤️ Like and engage with content
- 🏷️ Browse by category (Theology, Evangelism, Apologetics, etc.)
- 🙏 Build community through faith-based discussions

---

## 🚀 Tech Stack

**Frontend:** React  
**Backend:** Express.js, Node.js  
**Database:** PostgreSQL  
**Authentication:** JWT (JSON Web Token)

---

## ⚙️ Installation & Setup

### 🧱 1️⃣ Clone the Repository

```bash
git clone ...
cd GospelReach

🗄️ 2️⃣ Create the Database

Open your PostgreSQL shell and run:
CREATE DATABASE gospelreach;

No need to manually create tables — initDB.js handles that automatically when the server starts.

🔐 3️⃣ Configure Environment Variables

Create a .env file in the root directory:

DATABASE_URL=postgresql://postgres:<yourpassword>@localhost:5432/gospelreach
JWT_SECRET=your_secret_key_here
PORT=5000

🧩 4️⃣ Install Dependencies
Backend:
npm install

Frontend:
cd client
npm install

🖥️ 5️⃣ Run the App

In two terminals:

Backend:
npm run dev

Frontend:
cd client
npm start

Then open your browser at:
http://localhost:3000

🧠 Core Features
Feature	Description
👤 User Authentication	Register, log in, and log out securely with JWT
📰 Create/Edit/Delete Posts	Users can write and manage devotionals and sermons
💬 Comment System	Add and delete comments under posts
❤️ Like System	Like/unlike posts with color feedback
🏷️ Category Filter	View posts by categories like Theology or Evangelism
🔒 Protected Routes	/create-post is restricted to logged-in users
🧭 Dynamic Navbar	Switches between “Log In” and “Log Out” automatically

🧰 Auto Database Setup

When the backend starts, it automatically:

🏗️ Creates the necessary tables (users, posts, comments, likes, categories)

🌱 Seeds the default GospelReach categories:

Theology
Evangelism
Apologetics
Christian Living
Church History
Prayer
Discipleship


No manual SQL setup required 🎉

🎨 UI Behavior Highlights

✅ Navbar now appears on all pages
✅ “Create Post” button only shows when logged in
✅ “Like” button:

Disabled for guests

Turns red when liked

Updates counts live
✅ Comments auto-refresh after posting or deletion
✅ Categories load dynamically from the database
✅ Editing a post pre-fills the title, content, and category fields

🔒 Security

JWT-based authentication stored in localStorage

Authorization middleware protects backend routes

Parameterized SQL queries prevent injection attacks

Auto table creation ensures consistent DB schema across setups

🧪 Testing Checklist
Test	Expected Result
🧍 Register/Login	Creates a new account and generates JWT
✍️ Create Post	Adds a post and appears in the feed
🧾 Edit Post	Opens with prefilled data
🗑️ Delete Post	Removes post from database
❤️ Like/Unlike	Toggles color and count instantly
💬 Comment	Adds comment under correct post
🚫 Logged Out User	Can’t access /create-post or like posts
🔄 Refresh	Likes and comments persist
```

🙏 Closing Note

“Let everything you do be done in love.” — 1 Corinthians 16:14

GospelReach was built to empower believers to share their faith, uplift others, and build a Christ-centered online community.
