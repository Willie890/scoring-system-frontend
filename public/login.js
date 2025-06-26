document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorEl = document.getElementById("loginError");

        try {
            showLoading(true);
            
            const response = await apiRequest('/api/auth/login', 'POST', { 
                username: username,
                password: password 
            });

            // Store authentication data
            localStorage.setItem("token", response.token);
            localStorage.setItem("loggedInUser", JSON.stringify({
                username: response.user.username,
                role: response.user.role
            }));
            
            // Redirect based on role
            if (response.user.role === "admin") {
                window.location.href = "admin_home.html";
            } else {
                window.location.href = "user_home.html";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorEl.textContent = error.message || "Login failed. Please try again.";
            document.getElementById("password").value = "";
        } finally {
            showLoading(false);
        }
    });
});
