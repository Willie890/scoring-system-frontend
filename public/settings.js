document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.role !== "admin") {
        alert("Admin access required");
        window.location.href = "index.html";
        return;
    }

    // Initialize users dropdown
    loadUsers();

    // Password Change Form
    document.getElementById("changePasswordForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const username = document.getElementById("userSelect").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            showMessage("Passwords don't match", "red");
            return;
        }

        try {
            showLoading(true);
            await apiRequest(`/api/users/${username}/password`, 'POST', {
                newPassword
            });
            
            showMessage("Password changed successfully!", "green");
            this.reset();
        } catch (error) {
            console.error("Password change error:", error);
            showMessage("Failed to change password", "red");
        } finally {
            showLoading(false);
        }
    });

    // Reset Buttons
    document.getElementById("resetPointsBtn").addEventListener("click", resetPoints);
    document.getElementById("resetHistoryBtn").addEventListener("click", resetHistory);
    document.getElementById("resetAllBtn").addEventListener("click", resetEverything);
});

async function loadUsers() {
    try {
        showLoading(true);
        const response = await apiRequest('/api/users');
        const userSelect = document.getElementById("userSelect");
        userSelect.innerHTML = '<option value="">Select a user</option>';
        
        response.users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.username;
            option.textContent = user.username;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to load users:", error);
        showError("Failed to load users");
    } finally {
        showLoading(false);
    }
}

async function resetPoints() {
    if (!confirm("Reset ALL points to zero?")) return;
    
    try {
        showLoading(true);
        await apiRequest('/api/admin/reset-points', 'POST');
        showResetMessage("Points reset successfully", "green");
        window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
    } catch (error) {
        console.error("Reset points error:", error);
        showResetMessage("Failed to reset points", "red");
    } finally {
        showLoading(false);
    }
}

async function resetHistory() {
    if (!confirm("Clear ALL history? This cannot be undone.")) return;
    
    try {
        showLoading(true);
        await apiRequest('/api/admin/reset-history', 'POST');
        showResetMessage("History cleared successfully", "green");
        window.dispatchEvent(new CustomEvent('historyUpdated'));
    } catch (error) {
        console.error("Reset history error:", error);
        showResetMessage("Failed to reset history", "red");
    } finally {
        showLoading(false);
    }
}

async function resetEverything() {
    if (!confirm("Reset EVERYTHING? This will:\n\n- Reset all points to zero\n- Clear all history\n- Reset all requests\n\nThis cannot be undone.")) return;
    
    try {
        showLoading(true);
        await apiRequest('/api/admin/reset-all', 'POST');
        showResetMessage("Complete system reset performed", "green");
        window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
        window.dispatchEvent(new CustomEvent('historyUpdated'));
    } catch (error) {
        console.error("Reset all error:", error);
        showResetMessage("Failed to perform system reset", "red");
    } finally {
        showLoading(false);
    }
}

function showMessage(text, color) {
    const el = document.getElementById("passwordMessage");
    el.textContent = text;
    el.style.color = color;
    setTimeout(() => el.textContent = "", 3000);
}

function showResetMessage(text, color) {
    const el = document.getElementById("resetMessage");
    el.textContent = text;
    el.style.color = color;
    setTimeout(() => el.textContent = "", 5000);
}

