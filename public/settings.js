document.addEventListener('DOMContentLoaded', async function() {
  // Verify admin
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.role !== 'admin') {
    alert('Admin access required');
    logout();
    return;
  }

  // Load users
  await loadUsers();

  // Password form
  document.getElementById('passwordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('userSelect').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('passwordMessage');

    if (newPassword !== confirmPassword) {
      messageEl.textContent = 'Passwords do not match';
      messageEl.style.color = 'red';
      return;
    }

    try {
      showLoading(true);
      await apiRequest(`/api/users/${username}/password`, 'POST', { newPassword });
      
      messageEl.textContent = 'Password changed successfully';
      messageEl.style.color = 'green';
      this.reset();
    } catch (error) {
      messageEl.textContent = error.message || 'Failed to change password';
      messageEl.style.color = 'red';
      console.error(error);
    } finally {
      showLoading(false);
    }
  });

  // Reset buttons
  document.getElementById('resetPointsBtn').addEventListener('click', resetPoints);
  document.getElementById('resetHistoryBtn').addEventListener('click', resetHistory);
});

async function loadUsers() {
  try {
    showLoading(true);
    const { users } = await apiRequest('/api/users');
    
    const select = document.getElementById('userSelect');
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.username;
      option.textContent = user.username;
      select.appendChild(option);
    });
  } catch (error) {
    showError('Failed to load users');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

async function resetPoints() {
  if (!confirm('Reset ALL points to zero? This cannot be undone.')) return;

  try {
    showLoading(true);
    await apiRequest('/api/admin/reset-points', 'POST');
    showSuccess('All points have been reset');
  } catch (error) {
    showError('Failed to reset points');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

async function resetHistory() {
  if (!confirm('Permanently delete ALL history? This cannot be undone.')) return;

  try {
    showLoading(true);
    await apiRequest('/api/admin/reset-history', 'POST');
    showSuccess('History has been cleared');
  } catch (error) {
    showError('Failed to clear history');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

