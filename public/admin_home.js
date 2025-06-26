document.addEventListener("DOMContentLoaded", function() {
    // Initialize the leaderboard
    renderTable();
    
    // Setup popup controls
    setupPopup();
});

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
                    <td class="point-buttons">
                        ${[-50, -30, -20, -10, 2, 5, 10, 20, 50].map(points => `
                            <button onclick="window.openReasonPopup('${user.username}', ${points})">
                                ${points > 0 ? '+' + points : points}
                            </button>
                        `).join('')}
                    </td>
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

function setupPopup() {
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

    window.confirmReason = async function() {
        const presetReason = document.getElementById("presetReason").value.trim();
        const extraReason = document.getElementById("extraReason").value.trim();
        const reason = presetReason || extraReason;

        if (!reason) {
            showError("Please select or enter a reason");
            return;
        }

        try {
            showLoading(true);
            await apiRequest('/api/leaderboard/update', 'POST', {
                username: selectedUserName,
                points: selectedPointValue,
                reason: reason,
                notes: extraReason || "No additional notes"
            });
            
            closeReasonPopup();
            renderTable();
            showSuccess("Score updated successfully!");
        } catch (error) {
            console.error('Failed to update score:', error);
            showError('Failed to update score');
        } finally {
            showLoading(false);
        }
    };
}

// Listen for updates from other pages
window.addEventListener('leaderboardUpdated', renderTable);






