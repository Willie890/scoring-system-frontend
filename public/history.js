import { getHistory } from './api.js';
import { logout } from './common.js';

window.logout = logout;

async function renderHistory(filters = {}) {
  try {
    const { history } = await getHistory();
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';

    const filtered = history.filter(entry => {
      const matchesUser = !filters.user || entry.user === filters.user;
      const matchesReason = !filters.reason || entry.reason.includes(filters.reason);
      const matchesDate = !filters.date || new Date(entry.timestamp).toDateString() === new Date(filters.date).toDateString();
      return matchesUser && matchesReason && matchesDate;
    });

    filtered.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.user}</td>
        <td class="${entry.points >= 0 ? 'positive' : 'negative'}">${entry.points}</td>
        <td>${entry.reason}</td>
        <td>${entry.notes || 'None'}</td>
        <td>${new Date(entry.timestamp).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading history:', error);
    alert(error.message || 'Failed to load history');
  }
}

window.applyFilters = () => {
  const filters = {
    user: document.getElementById('filterName').value === 'all' ? null : document.getElementById('filterName').value,
    reason: document.getElementById('filterReason').value === 'all' ? null : document.getElementById('filterReason').value,
    date: document.getElementById('filterDate').value || null
  };
  renderHistory(filters);
};

window.resetFilters = () => {
  document.getElementById('filterName').value = 'all';
  document.getElementById('filterReason').value = 'all';
  document.getElementById('filterDate').value = '';
  renderHistory();
};

document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  document.getElementById('homeLink').href = user?.role === 'admin' ? 'admin_home.html' : 'user_home.html';

  const { history } = await getHistory();
  
  const names = [...new Set(history.map(h => h.user))];
  const reasons = [...new Set(history.map(h => h.reason))];
  
  const nameSelect = document.getElementById('filterName');
  nameSelect.innerHTML = '<option value="all">All Names</option>';
  names.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    nameSelect.appendChild(option);
  });

  const reasonSelect = document.getElementById('filterReason');
  reasonSelect.innerHTML = '<option value="all">All Reasons</option>';
  reasons.forEach(reason => {
    const option = document.createElement('option');
    option.value = reason;
    option.textContent = reason;
    reasonSelect.appendChild(option);
  });

  await renderHistory();
});
