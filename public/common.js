const API_BASE_URL = 'https://vt-engineering-leaderboard.onrender.com';

// Common user data
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

// API Request Helper
async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            // If unauthorized, force logout
            if (response.status === 401) {
                logout();
            }
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// UI Helpers
function showLoading(show) {
    const loader = document.getElementById('loading-overlay') || 
        document.body.appendChild(document.createElement('div'));
    loader.id = 'loading-overlay';
    loader.style.cssText = show ? `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 2rem;
    ` : 'display: none';
    if (show) loader.innerHTML = 'Loading...';
}

function showError(message) {
    const errorEl = document.getElementById('error-message') || 
        document.body.appendChild(document.createElement('div'));
    errorEl.id = 'error-message';
    errorEl.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px;
        background: #f44336;
        color: white;
        border-radius: 4px;
        z-index: 9999;
    `;
    errorEl.textContent = message;
    setTimeout(() => errorEl.remove(), 5000);
}

function showSuccess(message) {
    const successEl = document.getElementById('success-message') || 
        document.body.appendChild(document.createElement('div'));
    successEl.id = 'success-message';
    successEl.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px;
        background: #4CAF50;
        color: white;
        border-radius: 4px;
        z-index: 9999;
    `;
    successEl.textContent = message;
    setTimeout(() => successEl.remove(), 5000);
}

// Authentication
window.logout = function(e) {
    if (e) e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
};

// Initialize authentication check on protected pages
document.addEventListener("DOMContentLoaded", function() {
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
