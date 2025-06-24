document.addEventListener("DOMContentLoaded", function() {
    // Initialize scores if they don't exist
    initializeScores();
    
    const renderTable = () => {
        try {
            const scores = JSON.parse(localStorage.getItem("scores")) || {};
            const tableBody = document.getElementById("scoreTableBody");
            
            if (!tableBody) {
                console.error("Table body element not found");
                return;
            }
            
            // Create array of users with their scores, then sort
            const sortedUsers = appUsers
                .map(user => ({ 
                    name: user, 
                    score: scores[user] || 0 
                }))
                .sort((a, b) => b.score - a.score);
            
            // Clear and rebuild the table
            tableBody.innerHTML = sortedUsers
                .map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.score}</td>
                    </tr>`
                ).join('');
        } catch (error) {
            console.error("Error rendering table:", error);
        }
    };

    // Listen for updates
    window.addEventListener('leaderboardUpdated', renderTable);
    window.addEventListener('historyUpdated', renderTable);
    
    // Initial render
    renderTable();
});