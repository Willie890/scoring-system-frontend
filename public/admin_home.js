// admin_home.js
import { getLeaderboardData, updateUserScore, logHistoryEntry } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#leaderboardTable tbody');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorDisplay = document.getElementById('errorDisplay');

  async function loadLeaderboard() {
    try {
      showLoading();
      const users = await getLeaderboardData();
      renderTable(users);
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  }

  function renderTable(users) {
    tableBody.innerHTML = '';
    
    if (!users || users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
      return;
    }

    users.forEach((user, index) => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.score}</td>
        <td>
          <button class="adjust-btn" data-username="${user.username}">
            Adjust
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });

    // Add event listeners to all adjust buttons
    document.querySelectorAll('.adjust-btn').forEach(btn => {
      btn.addEventListener('click', handleAdjustClick);
    });
  }

  async function handleAdjustClick(event) {
    const username = event.target.dataset.username;
    const row = event.target.closest('tr');
    const currentScore = parseInt(row.querySelector('td:nth-child(3)').textContent);
    
    const newScore = prompt(`Enter new score for ${username}:`, currentScore);
    if (!newScore || isNaN(newScore)) return;

    const reason = prompt('Reason for adjustment:') || 'Manual adjustment';
    
    try {
      await updateUserScore(username, newScore - currentScore, reason, 'Admin adjustment');
      await loadLeaderboard(); // Refresh the table
      
      // Log to history
      await logHistoryEntry({
        user: username,
        points: newScore - currentScore,
        reason,
        action: 'points_adjustment',
        admin: JSON.parse(localStorage.getItem('loggedInUser')).username
      });
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  // Helper functions
  function showLoading() {
    loadingIndicator.style.display = 'block';
    tableBody.style.opacity = '0.5';
  }

  function hideLoading() {
    loadingIndicator.style.display = 'none';
    tableBody.style.opacity = '1';
  }

  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    setTimeout(() => errorDisplay.style.display = 'none', 5000);
  }

  // Initial load
  loadLeaderboard();
});






