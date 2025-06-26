document.addEventListener('DOMContentLoaded', async function() {
  try {
    showLoading(true);
    const { users } = await apiRequest('/api/leaderboard');
    const tableBody = document.getElementById('scoreTableBody');
    
    tableBody.innerHTML = users
      .sort((a, b) => b.score - a.score)
      .map(user => `
        <tr>
          <td>${user.username}</td>
          <td>${user.score}</td>
        </tr>
      `).join('');
  } catch (error) {
    showError('Failed to load leaderboard');
    console.error('Leaderboard error:', error);
  } finally {
    showLoading(false);
  }
});
