document.addEventListener("DOMContentLoaded", function() {
    // Check admin status
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.role !== "admin") {
        alert("Access denied. Admins only.");
        window.location.href = "index.html";
        return;
    }

    const tbody = document.querySelector("#notificationsTable tbody");
    const users = [
        "Jp Faber",
        "Stefan van Der Merwe",
        "Ewan Van Eeden",
        "Frikkie Van Der Heever",
        "Carlo Engela",
        "Zingisani Mavumengwana",
        "Hlobelo Serathi",
        "Patrick Mokotoamane"
    ];

    function loadRequests() {
        try {
            return JSON.parse(localStorage.getItem("requests")) || [];
        } catch (e) {
            console.error("Error loading requests:", e);
            return [];
        }
    }

    function loadScores() {
        try {
            const scores = JSON.parse(localStorage.getItem("scores")) || {};
            // Initialize scores for all users if they don't exist
            users.forEach(user => {
                if (scores[user] === undefined) {
                    scores[user] = 0;
                }
            });
            return scores;
        } catch (e) {
            console.error("Error loading scores:", e);
            return {};
        }
    }

    function saveRequests(requests) {
        localStorage.setItem("requests", JSON.stringify(requests));
    }

    function saveScores(scores) {
        localStorage.setItem("scores", JSON.stringify(scores));
    }

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

    function renderRequests() {
        const requests = loadRequests();
        tbody.innerHTML = "";
        
        const pendingRequests = requests.filter(req => req.status === "pending");
        
        if (pendingRequests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No pending requests</td></tr>';
            return;
        }

        pendingRequests.forEach((request, index) => {
            const row = document.createElement("tr");
            
            // Requested By
            const requestedByCell = document.createElement("td");
            requestedByCell.textContent = request.requestingUser;
            row.appendChild(requestedByCell);
            
            // Recipient
            const recipientCell = document.createElement("td");
            recipientCell.textContent = request.receivingUser;
            row.appendChild(recipientCell);
            
            // Points
            const pointsCell = document.createElement("td");
            pointsCell.textContent = request.points > 0 ? `+${request.points}` : request.points;
            pointsCell.className = request.points >= 0 ? "positive" : "negative";
            row.appendChild(pointsCell);
            
            // Reason
            const reasonCell = document.createElement("td");
            reasonCell.textContent = request.reason;
            row.appendChild(reasonCell);
            
            // Additional Notes
            const notesCell = document.createElement("td");
            notesCell.className = "notes-cell";
            notesCell.textContent = request.additionalNotes || "None";
            row.appendChild(notesCell);
            
            // Status
            const statusCell = document.createElement("td");
            statusCell.textContent = "pending";
            row.appendChild(statusCell);
            
            // Actions
            const actionsCell = document.createElement("td");
            actionsCell.className = "action-buttons";
            
            const approveBtn = document.createElement("button");
            approveBtn.textContent = "Approve";
            approveBtn.className = "approve-btn";
            approveBtn.onclick = () => handleRequest(index, true);
            
            const rejectBtn = document.createElement("button");
            rejectBtn.textContent = "Reject";
            rejectBtn.className = "reject-btn";
            rejectBtn.onclick = () => handleRequest(index, false);
            
            actionsCell.appendChild(approveBtn);
            actionsCell.appendChild(rejectBtn);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });
    }

    function handleRequest(index, isApproved) {
        let requests = loadRequests();
        let scores = loadScores();
        const request = requests[index];
        
        // Update request status
        request.status = isApproved ? "approved" : "rejected";
        requests[index] = request;
        
        if (isApproved) {
            // Update scores
            if (scores[request.receivingUser] !== undefined) {
                scores[request.receivingUser] = (scores[request.receivingUser] || 0) + request.points;
            }
        }
        
        // Add to history
        addHistoryEntry({
            user: request.receivingUser,
            points: request.points,
            reason: request.reason,
            notes: `Request ${isApproved ? "approved" : "rejected"}: ${request.additionalNotes || "No additional notes"}`,
            timestamp: new Date().toISOString()
        });
        
    // Save changes
    saveRequests(requests);
    saveScores(scores);
    
    // Dispatch both events
    window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
    window.dispatchEvent(new CustomEvent('historyUpdated'));
    
    // Refresh display
    renderRequests();
    alert(`Request ${isApproved ? "approved" : "rejected"} successfully!`);
}

    // Initial render
    renderRequests();
});
