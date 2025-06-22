document.addEventListener("DOMContentLoaded", function() {
    // Load and display history
       const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const homeLink = document.getElementById("homeLink");
    
    if (loggedInUser) {
        homeLink.href = loggedInUser.role === "admin" ? "admin_home.html" : "user_home.html";
    } else {
        homeLink.href = "index.html"; // Fallback if not logged in
    }
	function loadHistory() {
        try {
            return JSON.parse(localStorage.getItem("history")) || [];
        } catch (e) {
            console.error("Error loading history:", e);
            return [];
        }
    }

   function populateHistoryTable(data) {
    const tableBody = document.getElementById("historyTableBody");
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        
        // Standardize the data
        const entry = {
            user: item.user || item.name || "SYSTEM",
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
        
        // Reason cell (show only the reason)
        const reasonCell = document.createElement('td');
        const reasonSpan = document.createElement('span');
        reasonSpan.className = 'truncated-text';
        reasonSpan.textContent = entry.reason;
        reasonSpan.onclick = () => showFullText(entry.reason);
        reasonCell.appendChild(reasonSpan);
        row.appendChild(reasonCell);
        
        // Notes cell (show only the notes)
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

    // Filter functions
    window.applyFilters = function() {
        const nameFilter = document.getElementById("filterName").value.toLowerCase();
        const reasonFilter = document.getElementById("filterReason").value.toLowerCase();
        const dateFilter = document.getElementById("filterDate").value;
        const history = loadHistory();

        const filtered = history.filter(item => {
            const entry = {
                user: item.user || item.name || "SYSTEM",
                reason: item.reason || "System Operation",
                timestamp: item.timestamp || new Date().toISOString()
            };
            
            const itemDate = new Date(entry.timestamp).toLocaleDateString();
            const filterDate = dateFilter ? new Date(dateFilter).toLocaleDateString() : null;
            
            return (nameFilter === "all" || entry.user.toLowerCase().includes(nameFilter)) &&
                   (reasonFilter === "all" || entry.reason.toLowerCase().includes(reasonFilter)) &&
                   (!dateFilter || itemDate === filterDate);
        });
        
        populateHistoryTable(filtered);
    };
    
    window.resetFilters = function() {
        document.getElementById("filterName").value = "all";
        document.getElementById("filterReason").value = "all";
        document.getElementById("filterDate").value = "";
        populateHistoryTable(loadHistory());
    };

    // Initialize filters
    function initializeFilters() {
        const history = loadHistory();
        const nameSelect = document.getElementById("filterName");
        const reasonSelect = document.getElementById("filterReason");
        
        nameSelect.innerHTML = '<option value="all">All Names</option>';
        reasonSelect.innerHTML = '<option value="all">All Reasons</option>';
        
        // Get unique names and reasons
        const names = [...new Set(history.map(item => item.user || item.name || "SYSTEM"))];
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

    // Listen for history updates
    window.addEventListener('historyUpdated', function() {
        populateHistoryTable(loadHistory());
    });

    // Refresh when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            populateHistoryTable(loadHistory());
        }
    });

    // Initial setup
    initializeFilters();
    populateHistoryTable(loadHistory());
});

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
        alert("Text copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === document.getElementById("textModal")) {
        closeModal();
    }
};
