// common.js
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
    // Ensure all appUsers exist with proper scores
    appUsers.forEach(user => {
        if (scores[user] === undefined || typeof scores[user] !== 'number') {
            scores[user] = 0;
        }
    });
    localStorage.setItem("scores", JSON.stringify(scores));
    return scores;
}

function updateLeaderboard() {
    window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
}
function updateScores(user, pointsChange) {
    let scores = JSON.parse(localStorage.getItem("scores")) || {};
    scores[user] = (scores[user] || 0) + pointsChange;
    localStorage.setItem("scores", JSON.stringify(scores));
    window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
}

// Universal logout function
window.logout = function(e) {
    if (e) e.preventDefault();
    try {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout error:", error);
        window.location.href = "index.html";
    }
};

// Initialize logout event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Add logout event listeners to all logout links
    document.querySelectorAll('[onclick*="logout"]').forEach(element => {
        element.onclick = window.logout;
    });
});