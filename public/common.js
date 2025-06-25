// common.js - Complete updated file
const appUsers = [
    "Jp Faber",
    "Stefan van Der Merwe",
    "Ewan Van Eeden",
    "Frikkie Van Der Heever",
    "Carlo Engela",
    "Zingisani Mavumengwana",
    "Hlobelo Serathi",
    "Prins Moyo",
    "Patrick Mokotoamane"
];

const presetReasons = [
    "Improvement Initiative",
    "3S Adherence",
    "Preventative Maintenance",
    "Defect Reduction",
    "Efficiency Gains",
    "Skill Development",
    "Kaizen Suggestion",
    "Team Contribution",
    "Tooling Return Failure",
    "Kiosk Misconduct",
    "Rework or Delay",
    "Maintenance Checklist failure",
    "Safety Violations",
    "Tool Breakage"
];

function initializeScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || {};
    appUsers.forEach(user => {
        if (scores[user] === undefined || typeof scores[user] !== 'number') {
            scores[user] = 0;
        }
    });
    localStorage.setItem("scores", JSON.stringify(scores));
    return scores;
}

function updateScores(user, pointsChange) {
    let scores = JSON.parse(localStorage.getItem("scores")) || {};
    scores[user] = (scores[user] || 0) + pointsChange;
    localStorage.setItem("scores", JSON.stringify(scores));
    window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
}

// Enhanced logout function
window.logout = function(e) {
    if (e) e.preventDefault();
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout error:", error);
        window.location.href = "index.html";
    }
};

// Initialize logout event listeners
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('[onclick*="logout"]').forEach(element => {
        element.onclick = window.logout;
    });
    
    // Add authentication check to protected pages
    const protectedPages = ['admin_home.html', 'user_home.html', 'settings.html', 'history.html', 'request_points.html'];
    if (protectedPages.some(page => window.location.pathname.endsWith(page))) {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
        
        if (!token && !user.username) {
            window.location.href = "index.html";
            return;
        }
        
        // Redirect admin trying to access user pages and vice versa
        if (window.location.pathname.includes("admin") && user.role !== "admin") {
            window.location.href = "user_home.html";
        }
    }
});
