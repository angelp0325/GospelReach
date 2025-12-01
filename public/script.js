// Handles signup, login, and verifying login token for GospelReach Authentication demo.

const API_URL = "http://localhost:5000/auth";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupButton").addEventListener("click", signup);
  document.getElementById("loginButton").addEventListener("click", login);
});

//SIGN UP FUNCTION
async function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    showResponse({ message: "Please fill out all signup fields." });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.id) {
      showResponse({
        message: `Account created for ${data.name}! You can now log in.`,
      });
    } else {
      showResponse(data);
    }
  } catch (err) {
    showResponse({ error: "Something went wrong during signup." });
  }
}

// LOGIN FUNCTION
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showResponse({ message: "⚠️ Please enter your email and password." });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      // Save token and show welcome message
      localStorage.setItem("jwtToken", data.token);
      showResponse({
        message: `Welcome back, ${data.name}! You are now logged in.`,
      });

      //Automatically check the token
      checkLoginStatus();
    } else {
      showResponse(data);
    }
  } catch (err) {
    showResponse({ error: "Something went wrong during login." });
  }
}

// VERIFY LOGIN FUNCTION
async function checkLoginStatus() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.user) {
      showResponse({
        message: `You are logged in as ${data.user.name} (${data.user.email})`,
        token: token.slice(0, 20) + "...",
      });
    } else {
      showResponse({ message: "Token invalid or expired." });
    }
  } catch (err) {
    showResponse({ message: "Error verifying login." });
  }
}

//DISPLAY FUNCTION
function showResponse(data) {
  const box = document.getElementById("responseBox");
  box.textContent = JSON.stringify(data, null, 2);
}
