// login.js - Complete updated file
document.addEventListener("DOMContentLoaded", function() {
    // Initialize users in localStorage if empty
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

    // Login form submission
    document.getElementById("loginForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorEl = document.getElementById("loginError");

        try {
            // First try backend login
            const apiUrl = process.env.REACT_APP_API_URL || 'https://your-render-backend.onrender.com';
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                window.location.href = data.user.role === "admin" ? "admin_home.html" : "user_home.html";
                return;
            }

            // Fallback to local authentication if backend fails
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => 
                u.username.toLowerCase() === username.toLowerCase() && 
                u.password === password
            );

            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                window.location.href = user.role === "admin" ? "admin_home.html" : "user_home.html";
            } else {
                throw new Error("Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            errorEl.textContent = error.message || "Login failed. Please try again.";
            document.getElementById("password").value = "";
        }
    });
});



