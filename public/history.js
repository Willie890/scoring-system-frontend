document.addEventListener('DOMContentLoaded', async function() {
  // Set home link based on role
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  document.getElementById('homeLink').href = user?.role === 'admin' 
    ? 'admin_home.html' 
    : 'user_home.html';

  await loadHistory();
});

async function loadHistory() {
  try {
    showLoading(true);
    const { history } = await apiRequest('/api/history');
    
    // Populate table
    renderHistory(history);
    
    // Populate filters
    const users = [...new Set(history.map(item => item.user))];
    const userSelect = document.getElementById('filterUser');
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user;
      option.textContent = user;
      userSelect.appendChild(option);
    });
    
  } catch (error) {
    showError('Failed to load history');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

function renderHistory(history) {
  const tbody = document.getElementById('historyTableBody');
  
  if (history.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="no-data">No history found</td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = history.map(item => `
    <tr>
      <td>${item.user}</td>
      <td class="${item.points >= 0 ? 'positive' : 'negative'}">
        ${item.points >= 0 ? '+' : ''}${item.points}
      </td>
      <td>${item.reason}</td>
      <td>${item.admin || 'System'}</td>
      <td>${new Date(item.timestamp).toLocaleString()}</td>
    </tr>
  `).join('');
}

window.applyFilters = async function() {
  const user = document.getElementById('filterUser').value;
  const date = document.getElementById('filterDate').value;
  
  try {
    showLoading(true);
    let url = '/api/history?';
    if (user !== 'all') url += `user=${encodeURIComponent(user)}&`;
    if (date) url += `date=${date}`;
    
    const { history } = await apiRequest(url);
    renderHistory(history);
  } catch (error) {
    showError('Failed to filter history');
    console.error(error);
  } finally {
    showLoading(false);
  }
};

window.resetFilters = function() {
  document.getElementById('filterUser').value = 'all';
  document.getElementById('filterDate').value = '';
  loadHistory();
};
