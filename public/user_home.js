import { getScores } from './api.js';
import { appUsers, logout } from './common.js';

window.logout = logout;

async function renderLeaderboard() {
  try {
    const scores = await getScores();
    const tableBody = document.getElementById('scoreTableBody');
    tableBody.innerHTML = '';

    appUsers.map(user => ({
      name: user,
      score: scores[user] || 0
    }))
    .sort((a, b) => b.score - a.score)
    .forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.score}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    alert(error.message || 'Failed to load leaderboard');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
    return;
  }
  await renderLeaderboard();
});
