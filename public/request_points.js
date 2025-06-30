document.addEventListener('DOMContentLoaded', async function() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    logout();
    return;
  }

  try {
    showLoading(true);
    const { users: leaderboardUsers } = await apiRequest('/api/leaderboard');
    
    const requestingSelect = document.getElementById('requestingUser');
    const receivingSelect = document.getElementById('receivingUser');
    
    requestingSelect.innerHTML = '<option value="">Select requester</option>';
    receivingSelect.innerHTML = '<option value="">Select recipient</option>';
    
    leaderboardUsers.forEach(userData => {
      const requestOption = document.createElement('option');
      requestOption.value = userData.username;
      requestOption.textContent = userData.username;
      requestingSelect.appendChild(requestOption);
      
      if (userData.username !== user.username) {
        const receiveOption = document.createElement('option');
        receiveOption.value = userData.username;
        receiveOption.textContent = userData.username;
        receivingSelect.appendChild(receiveOption);
      }
    });
    
    requestingSelect.value = user.username;
  } catch (error) {
    showError('Failed to load user data');
    console.error(error);
  } finally {
    showLoading(false);
  }

  document.getElementById('requestForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('submitBtnText');
    const errorEl = document.getElementById('requestError');

    try {
      showLoading(true);
      btn.disabled = true;
      btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      const response = await apiRequest('/api/requests', 'POST', {
        receivingUser: document.getElementById('receivingUser').value,
        points: parseInt(document.getElementById('points').value),
        reason: document.getElementById('reason').value,
        additionalNotes: document.getElementById('additionalNotes').value || undefined
      });

      showSuccess('Request submitted successfully!');
      this.reset();
      document.getElementById('requestingUser').value = user.username;
    } catch (error) {
      errorEl.textContent = error.message || 'Failed to submit request';
      console.error('Request error:', error);
    } finally {
      showLoading(false);
      btn.disabled = false;
      btnText.textContent = 'Submit Request';
    }
  });
});

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
