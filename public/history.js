document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const homeLink = document.getElementById("homeLink");
    
    if (loggedInUser) {
        homeLink.href = loggedInUser.role === "admin" ? "admin_home.html" : "user_home.html";
    } else {
        homeLink.href = "index.html";
    }
    
    initializeFilters();
    loadAndRenderHistory();
});

async function loadAndRenderHistory() {
    try {
        showLoading(true);
        const history = await loadHistory();
        populateHistoryTable(history);
        initializeFilters(history);
    } catch (error) {
        console.error("Error loading history:", error);
        showError("Failed to load history data");
    } finally {
        showLoading(false);
    }
}

async function loadHistory() {
    try {
        const response = await apiRequest('/api/history');
        return response.history;
    } catch (error) {
        console.error("Error loading history:", error);
        throw error;
    }
}

function populateHistoryTable(history) {
    const tableBody = document.getElementById("historyTableBody");
    tableBody.innerHTML = '';
    
    if (history.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No history entries found</td>
            </tr>
        `;
        return;
    }

    history.forEach(item => {
        const row = document.createElement('tr');
        
        const entry = {
            user: item.user || "SYSTEM",
            points: typeof item.points === 'number' ? item.points : 0,
            reason: item.reason || "System Operation",
            notes: item.notes || item.additionalNotes || "No notes",
            timestamp: item.timestamp || new Date().toISOString()
        };

        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = entry.user;
        row.appendChild(nameCell);
        
        // Points cell
        const pointsCell = document.createElement('td');
        pointsCell.textContent = entry.points;
        pointsCell.className = entry.points >= 0 ? "positive" : "negative";
        row.appendChild(pointsCell);
        
        // Reason cell
        const reasonCell = document.createElement('td');
        const reasonSpan = document.createElement('span');
        reasonSpan.className = 'truncated-text';
        reasonSpan.textContent = entry.reason;
        reasonSpan.onclick = () => showFullText(entry.reason);
        reasonCell.appendChild(reasonSpan);
        row.appendChild(reasonCell);
        
        // Notes cell
        const notesCell = document.createElement('td');
        const notesSpan = document.createElement('span');
        notesSpan.className = 'truncated-text';
        notesSpan.textContent = entry.notes;
        notesSpan.onclick = () => showFullText(entry.notes);
        notesCell.appendChild(notesSpan);
        row.appendChild(notesCell);
        
        // Timestamp cell
        const timestampCell = document.createElement('td');
        try {
            timestampCell.textContent = new Date(entry.timestamp).toLocaleString();
        } catch (e) {
            timestampCell.textContent = "Invalid Date";
        }
        row.appendChild(timestampCell);
        
        tableBody.appendChild(row);
    });
}

function initializeFilters(history = []) {
    const nameSelect = document.getElementById("filterName");
    const reasonSelect = document.getElementById("filterReason");
    
    nameSelect.innerHTML = '<option value="all">All Names</option>';
    reasonSelect.innerHTML = '<option value="all">All Reasons</option>';
    
    // Get unique names and reasons
    const names = [...new Set(history.map(item => item.user || "SYSTEM"))];
    const reasons = [...new Set(history.map(item => item.reason || "System Operation"))];
    
    names.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
    });
    
    reasons.forEach(reason => {
        const option = document.createElement("option");
        option.value = reason;
        option.textContent = reason;
        reasonSelect.appendChild(option);
    });
}

window.applyFilters = async function() {
    const nameFilter = document.getElementById("filterName").value;
    const reasonFilter = document.getElementById("filterReason").value;
    const dateFilter = document.getElementById("filterDate").value;

    try {
        showLoading(true);
        let endpoint = '/api/history?';
        if (nameFilter !== "all") endpoint += `user=${encodeURIComponent(nameFilter)}&`;
        if (reasonFilter !== "all") endpoint += `reason=${encodeURIComponent(reasonFilter)}&`;
        if (dateFilter) endpoint += `date=${dateFilter}`;

        const response = await apiRequest(endpoint);
        populateHistoryTable(response.history);
    } catch (error) {
        console.error("Filter error:", error);
        showError("Failed to apply filters");
    } finally {
        showLoading(false);
    }
};

window.resetFilters = function() {
    document.getElementById("filterName").value = "all";
    document.getElementById("filterReason").value = "all";
    document.getElementById("filterDate").value = "";
    loadAndRenderHistory();
};

// Modal functions
function showFullText(fullText) {
    const modal = document.getElementById("textModal");
    const modalContent = document.getElementById("modalContent");
    modalContent.textContent = fullText;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("textModal").style.display = "none";
}

function copyToClipboard() {
    const text = document.getElementById("modalContent").textContent;
    navigator.clipboard.writeText(text).then(() => {
        showSuccess("Text copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        showError("Failed to copy text");
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === document.getElementById("textModal")) {
        closeModal();
    }
};

// Listen for history updates
window.addEventListener('historyUpdated', loadAndRenderHistory);
