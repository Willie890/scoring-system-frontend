document.addEventListener("DOMContentLoaded", function() {
    checkAuthentication().then(() => {
        renderTable();
    });
});

async function checkAuthentication() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        await apiRequest('/api/health');
    } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = 'index.html';
    }
}

async function renderTable() {
    try {
        showLoading(true);
        const response = await apiRequest('/api/leaderboard');
        const tableBody = document.getElementById("scoreTableBody");
        
        if (!tableBody) {
            console.error("Table body element not found");
            return;
        }
        
        // Create sorted table rows
        tableBody.innerHTML = response.users
            .map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.score}</td>
                </tr>`
            ).join('');
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        showError("Failed to load leaderboard data");
    } finally {
        showLoading(false);
    }
}

// Listen for updates from other pages
window.addEventListener('leaderboardUpdated', renderTable);
