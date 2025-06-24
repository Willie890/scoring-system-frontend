document.addEventListener("DOMContentLoaded", function() {
    // Initialize scores
    initializeScores();
    
    const scores = JSON.parse(localStorage.getItem("scores")) || {};
    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Global variables for selected user/points
    window.selectedUserName = null;
    window.selectedPointValue = null;

    // Render the leaderboard table
function renderTable() {
    const tableBody = document.getElementById("scoreTableBody");
    if (!tableBody) return;

    // Always get fresh scores from localStorage
    const scores = initializeScores(); // This ensures scores are properly initialized
    
    tableBody.innerHTML = "";

    // Create sorted array of users with their scores
    const sortedUsers = appUsers
        .map(user => ({
            name: user,
            score: scores[user] || 0
        }))
        .sort((a, b) => b.score - a.score);

    // Build the table rows
    sortedUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td class="point-buttons">
                ${[-50, -30, -20, -10, 2, 5, 10, 20, 50].map(points => `
                    <button onclick="window.openReasonPopup('${user.name}', ${points})">
                        ${points > 0 ? '+' + points : points}
                    </button>
                `).join('')}
            </td>
            <td>${user.score}</td>
        `;
        tableBody.appendChild(row);
    });
}

    // Popup control functions
    window.openReasonPopup = function(userName, pointValue) {
        window.selectedUserName = userName;
        window.selectedPointValue = pointValue;

        const dropdown = document.getElementById("presetReason");
        dropdown.innerHTML = '<option value="">-- Choose a reason --</option>';
        presetReasons.forEach(reason => {
            const option = document.createElement("option");
            option.value = reason;
            option.textContent = reason;
            dropdown.appendChild(option);
        });

        document.getElementById("extraReason").value = "";
        document.getElementById("reasonPopup").classList.remove("hidden");
    };

    window.closeReasonPopup = function() {
        document.getElementById("reasonPopup").classList.add("hidden");
    };

    window.confirmReason = function() {
        const presetReason = document.getElementById("presetReason").value.trim();
        const extraReason = document.getElementById("extraReason").value.trim();
        const reason = presetReason || extraReason;

        if (!reason) {
            alert("Please select or enter a reason");
            return;
        }

        // Update scores using the common.js function
        updateScores(selectedUserName, selectedPointValue);

        // Add to history
        history.push({
            user: selectedUserName,
            points: selectedPointValue,
            reason: presetReason,
            notes: extraReason || "No additional notes",
            timestamp: new Date().toISOString()
        });

        // Save history
        localStorage.setItem("history", JSON.stringify(history));
        
        // Dispatch events
        window.dispatchEvent(new CustomEvent('historyUpdated'));
        window.dispatchEvent(new CustomEvent('leaderboardUpdated'));

        // Close popup and re-render
        closeReasonPopup();
        renderTable();
    };

    // Initial render
    renderTable();
});






