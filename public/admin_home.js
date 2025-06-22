import { getScores, updateScores } from './api.js';
import { appUsers, presetReasons, logout } from './common.js';

window.logout = logout;
window.selectedUserName = null;
window.selectedPointValue = null;

window.openReasonPopup = (userName, pointValue) => {
  window.selectedUserName = userName;
  window.selectedPointValue = pointValue;
  document.getElementById('reasonPopup').classList.remove('hidden');
};

window.closeReasonPopup = () => {
  document.getElementById('reasonPopup').classList.add('hidden');
};

window.confirmReason = async () => {
  const presetReason = document.getElementById('presetReason').value;
  const extraReason = document.getElementById('extraReason').value;
  const reason = presetReason || extraReason;

  if (!reason) {
    alert('Please provide a reason');
    return;
  }

  try {
    await updateScores(window.selectedUserName, window.selectedPointValue, reason, extraReason);
    window.closeReasonPopup();
    await renderTable();
  } catch (error) {
    alert('Failed to update scores');
    console.error(error);
  }
};

async function renderTable() {
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
        <td class="point-buttons">
          ${[-50, -30, -20, -10, 2, 5, 10, 20, 50].map(p => `
            <button onclick="window.openReasonPopup('${user.name}', ${p})">
              ${p > 0 ? '+' + p : p}
            </button>
          `).join('')}
        </td>
        <td>${user.score}</td>
      `;
      tableBody.appendChild(row);
    });

    const reasonSelect = document.getElementById('presetReason');
    reasonSelect.innerHTML = '<option value="">-- Choose a reason --</option>';
    presetReasons.forEach(reason => {
      const option = document.createElement('option');
      option.value = reason;
      option.textContent = reason;
      reasonSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading scores:', error);
    alert('Failed to load scores');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }
  await renderTable();
});






