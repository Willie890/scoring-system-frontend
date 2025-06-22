import { getScores } from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    window.location.href = 'index.html';
    return;
  }

  const renderTable = async () => {
    try {
      const result = await getScores();
      const scores = result || {};
      const tableBody = document.getElementById('scoreTableBody');
      
      if (!tableBody) {
        console.error('Table body element not found');
        return;
      }
      
      const sortedUsers = appUsers
        .map(user => ({ 
          name: user, 
          score: scores[user] || 0 
        }))
        .sort((a, b) => b.score - a.score);
      
      tableBody.innerHTML = sortedUsers
        .map(user => `
          <tr>
            <td>${user.name}</td>
            <td>${user.score}</td>
          </tr>`
        ).join('');
    } catch (error) {
      console.error('Error rendering table:', error);
      alert('Failed to load leaderboard. Please refresh the page.');
    }
  };

  // Initial render
  await renderTable();
});