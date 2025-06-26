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

// Update renderHistory function
function renderHistory(history) {
  const tbody = document.getElementById('historyTableBody');
  
  tbody.innerHTML = history.map(item => `
    <tr>
      <td>${item.user}</td>
      <td class="${item.points >= 0 ? 'positive' : 'negative'}">
        ${item.points >= 0 ? '+' : ''}${item.points}
      </td>
      <td>${item.reason}</td>
      <td class="notes-preview" onclick="showFullNote('${item.notes.replace(/'/g, "\\'")}')">
        ${item.notes ? item.notes.substring(0, 20) + (item.notes.length > 20 ? '...' : '') : 'None'}
      </td>
      <td>${new Date(item.timestamp).toLocaleString()}</td>
    </tr>
  `).join('');
}

// Update applyFilters function
window.applyFilters = async function() {
  const user = document.getElementById('filterUser').value;
  const reason = document.getElementById('filterReason').value;
  const action = document.getElementById('filterAction').value;
  const date = document.getElementById('filterDate').value;
  
  try {
    showLoading(true);
    let url = '/api/history?';
    if (user !== 'all') url += `user=${encodeURIComponent(user)}&`;
    if (reason !== 'all') url += `reason=${encodeURIComponent(reason)}&`;
    if (action !== 'all') url += `action=${encodeURIComponent(action)}&`;
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
// Add note preview modal
window.showFullNote = function(note) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: flex; justify-content: center;
    align-items: center; z-index: 1000; cursor: pointer;
  `;
  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 80%; max-height: 80%; overflow: auto;">
      <p>${note}</p>
    </div>
  `;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
};

window.resetFilters = function() {
  document.getElementById('filterUser').value = 'all';
  document.getElementById('filterDate').value = '';
  loadHistory();
};
