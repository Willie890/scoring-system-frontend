document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("loginError");

  // User accounts with roles (now using array of objects instead of plain object)
  const users = [
    { username: "Jp Soutar", password: "1234", role: "admin" },
    { username: "Jp Faber", password: "1234", role: "admin" },
    { username: "user1", password: "5678", role: "user" }
  ];

  // Find user (case-insensitive username match)
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );

  if (user) {
    // Store the complete user object with role
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    
    // Redirect to appropriate page based on role
    window.location.href = user.role === "admin" ? "admin_home.html" : "user_home.html";
  } else {
    // Show error message in the div instead of alert
    errorEl.textContent = "Invalid username or password";
    // Clear password field
    document.getElementById("password").value = "";
  }
});

// Initialize users in localStorage if empty
document.addEventListener("DOMContentLoaded", function() {
  const defaultUsers = [
    { username: "Jp Soutar", password: "1234", role: "admin" },
    { username: "Jp Faber", password: "1234", role: "admin" },
    { username: "user1", password: "5678", role: "user" }
  ];

  try {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length === 0) {
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  } catch (e) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
});




