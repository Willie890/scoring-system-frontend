// settings.js
document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.role !== "admin") {
        alert("Admin access required");
        window.location.href = "index.html";
        return;
    }

    // Initialize users dropdown
    const userSelect = document.getElementById("userSelect");
    userSelect.innerHTML = '';
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (users.length === 0) {
        users = [
            { username: "Jp Soutar", password: "1234", role: "admin" },
            { username: "Jp Faber", password: "1234", role: "admin" },
            { username: "user1", password: "5678", role: "user" }
        ];
        localStorage.setItem("users", JSON.stringify(users));
    }
    
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.username;
        option.textContent = user.username;
        userSelect.appendChild(option);
    });

    // Password Change Form
    document.getElementById("changePasswordForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const username = document.getElementById("userSelect").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            showMessage("Passwords don't match", "red");
            return;
        }

        const currentUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = currentUsers.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
            showMessage("User not found", "red");
            return;
        }

        currentUsers[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(currentUsers));
        
        if (username === loggedInUser.username) {
            loggedInUser.password = newPassword;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        }
        
        showMessage("Password changed successfully!", "green");
        this.reset();
    });

    // Reset Buttons
    document.getElementById("resetPointsBtn").addEventListener("click", resetPoints);
    document.getElementById("resetHistoryBtn").addEventListener("click", resetHistory);
    document.getElementById("resetAllBtn").addEventListener("click", resetEverything);

    function addHistoryEntry(entry) {
        const history = JSON.parse(localStorage.getItem("history")) || [];
        history.push({
            user: entry.user || "SYSTEM",
            points: entry.points || 0,
            reason: entry.reason || "System Operation",
            notes: entry.notes || entry.additionalNotes || "No details provided",
            timestamp: entry.timestamp || new Date().toISOString()
        });
        localStorage.setItem("history", JSON.stringify(history));
        window.dispatchEvent(new CustomEvent('historyUpdated'));
    }

    function resetPoints() {
        if (!confirm("Reset ALL points to zero?")) return;
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const scores = {};
        users.forEach(user => scores[user.username] = 0);
        
        localStorage.setItem("scores", JSON.stringify(scores));
        
        addHistoryEntry({
            user: "SYSTEM",
            points: 0,
            reason: "System Reset",
            notes: "All points were reset to zero",
            timestamp: new Date().toISOString()
        });
        
        window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
        showResetMessage("Points reset successfully", "green");
    }

    function resetHistory() {
        if (!confirm("Clear ALL history? This cannot be undone.")) return;
        
        localStorage.setItem("history", JSON.stringify([]));
        window.dispatchEvent(new CustomEvent('historyUpdated'));
        
        addHistoryEntry({
            user: "SYSTEM",
            points: 0,
            reason: "System Reset",
            notes: "History was cleared",
            timestamp: new Date().toISOString()
        });
        
        showResetMessage("History cleared successfully", "green");
    }

function resetEverything() {
    if (!confirm("Reset EVERYTHING? This will:\n\n- Reset all points to zero\n- Clear all history\n- Reset all requests\n\nThis cannot be undone.")) return;
    
    // Reset points
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const scores = {};
    appUsers.forEach(user => scores[user] = 0); // Use appUsers from common.js
    localStorage.setItem("scores", JSON.stringify(scores));
    
    // Clear history
    localStorage.setItem("history", JSON.stringify([]));
    
    // Clear requests
    localStorage.setItem("requests", JSON.stringify([]));
    
    // Add a new history entry
    const newHistory = [{
        user: "SYSTEM",
        points: 0,
        reason: "System Reset",
        notes: "Complete system reset performed",
        timestamp: new Date().toISOString()
    }];
    localStorage.setItem("history", JSON.stringify(newHistory));
    
    // Force re-initialization of scores
    initializeScores();
    
    // Dispatch events
    window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
    window.dispatchEvent(new CustomEvent('historyUpdated'));
    
    showResetMessage("Complete system reset performed", "green");
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
});

