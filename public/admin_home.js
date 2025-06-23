// admin_home.js - Admin leaderboard with history tracking
import { 
  getLeaderboardWithDetails, 
  updateScores,
  logHistoryEntry,
  getHistory 
} from './api.js';

// DOM Elements
const leaderboardTable = document.getElementById('leaderboardTable');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorDisplay = document.getElementById('leaderboardError');
const refreshBtn = document.getElementById('refreshLeaderboard');

// Main function to load and render leaderboard
async function loadLeaderboard() {
  try {
    showLoadingState();
    const leaderboardData = await getLeaderboardWithDetails();
    renderLeaderboard(leaderboardData);
    hideLoadingState();
  } catch (error) {
    showError('Failed to load leaderboard. Please try again.');
    console.error('Leaderboard load error:', error);
  }
}

// UI State Management
function showLoadingState() {
  leaderboardTable.style.display = 'none';
  loadingIndicator.style.display = 'block';
  errorDisplay.textContent = '';
}

function hideLoadingState() {
  leaderboardTable.style.display = 'table';
  loadingIndicator.style.display = 'none';
}

function showError(message) {
  errorDisplay.textContent = message;
  loadingIndicator.style.display = 'none';
}

// Render leaderboard data to the table
function renderLeaderboard(data) {
  const tbody = leaderboardTable.querySelector('tbody');
  tbody.innerHTML = '';

  data.forEach((user, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username}</td>
      <td>${user.score}</td>
      <td><button class="adjust-btn" data-username="${user.username}">Adjust</button></td>
    `;
    
    tbody.appendChild(row);
  });

  // Add event listeners to all adjust buttons
  document.querySelectorAll('.adjust-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const username = e.target.getAttribute('data-username');
      const currentScore = parseInt(e.target.closest('tr').querySelector('td:nth-child(3)').textContent);
      showAdjustModal(username, currentScore);
    });
  });
}

// Score Adjustment Modal
function showAdjustModal(username, currentScore) {
  const modal = document.createElement('div');
  modal.className = 'adjust-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Adjust Points for ${username}</h3>
      <div class="form-group">
        <label>Current Points: ${currentScore}</label>
        <input type="number" id="newPoints" value="${currentScore}" min="0">
      </div>
      <div class="form-group">
        <label>Reason:</label>
        <input type="text" id="adjustReason" placeholder="Reason for adjustment" required>
      </div>
      <div class="form-group">
        <label>Notes:</label>
        <textarea id="adjustNotes" placeholder="Additional notes"></textarea>
      </div>
      <div class="modal-actions">
        <button id="cancelAdjust">Cancel</button>
        <button id="saveAdjust">Save Changes</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);

  // Modal event handlers
  document.getElementById('cancelAdjust').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  document.getElementById('saveAdjust').addEventListener('click', async () => {
    const newPoints = parseInt(document.getElementById('newPoints').value);
    const reason = document.getElementById('adjustReason').value;
    const notes = document.getElementById('adjustNotes').value;
    
    if (isNaN(newPoints)) {
      alert('Please enter a valid number for points');
      return;
    }
    
    if (!reason) {
      alert('Please provide a reason for the adjustment');
      return;
    }

    try {
      await updateScoreAndLogHistory(username, currentScore, newPoints, reason, notes);
      document.body.removeChild(modal);
      await loadLeaderboard(); // Refresh the leaderboard
    } catch (error) {
      alert(`Failed to update score: ${error.message}`);
    }
  });
}

// Update score and log to history
async function updateScoreAndLogHistory(username, oldScore, newPoints, reason, notes) {
  const pointsChange = newPoints - oldScore;
  const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  try {
    // Update the score
    await updateScores(username, pointsChange, reason, notes);
    
    // Log to history
    await logHistoryEntry({
      user: username,
      points: pointsChange,
      reason,
      notes,
      action: 'points_adjustment',
      admin: currentUser.username
    });
    
  } catch (error) {
    console.error('Error in update operation:', error);
    throw error;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadLeaderboard();
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadLeaderboard);
  }
});






