import { getUsers, changePassword, resetPoints, resetHistory, resetAll } from './api.js';
import { logout } from './common.js';

window.logout = logout;

document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.role !== 'admin') {
    alert('Admin access required');
    window.location.href = 'index.html';
    return;
  }

  // Initialize users dropdown
  const { users } = await getUsers();
  const userSelect = document.getElementById('userSelect');
  userSelect.innerHTML = '<option value="">Select user</option>';
  users.forEach(u => {
    const option = document.createElement('option');
    option.value = u.username;
    option.textContent = u.username;
    userSelect.appendChild(option);
  });

  // Password change form
  document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = userSelect.value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('passwordMessage');

    if (newPassword !== confirmPassword) {
      messageEl.textContent = 'Passwords do not match';
      messageEl.style.color = 'red';
      return;
    }

    try {
      const result = await changePassword(username, newPassword);
      messageEl.textContent = 'Password changed successfully';
      messageEl.style.color = 'green';
      e.target.reset();
    } catch (error) {
      messageEl.textContent = error.message || 'Failed to change password';
      messageEl.style.color = 'red';
    }
  });

  // Reset buttons
  document.getElementById('resetPointsBtn').addEventListener('click', async () => {
    if (confirm('Reset ALL points to zero?')) {
      await resetPoints();
      alert('Points reset');
    }
  });

  document.getElementById('resetHistoryBtn').addEventListener('click', async () => {
    if (confirm('Clear ALL history? This cannot be undone.')) {
      await resetHistory();
      alert('History cleared');
    }
  });

  document.getElementById('resetAllBtn').addEventListener('click', async () => {
    if (confirm('Reset EVERYTHING? This will:\n\n- Reset all points\n- Clear all history\n- Reset all requests')) {
      await resetAll();
      alert('Complete system reset performed');
    }
  });
});

