document.addEventListener('DOMContentLoaded', async function() {
  // Get logged in user
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    logout();
    return;
  }

  // Load all users for both dropdowns
  try {
    showLoading(true);
    const { users } = await apiRequest('/api/users');
    const { scores } = await apiRequest('/api/leaderboard');
    
    // Map usernames to their display names from scores
    const userDisplayNames = {};
    scores.forEach(score => {
      userDisplayNames[score.username] = score.username; // Or use a mapping if you have display names
    });

    // Populate requesting user dropdown
    const requestingSelect = document.getElementById('requestingUser');
    users.forEach(u => {
      const option = document.createElement('option');
      option.value = u.username;
      option.textContent = userDisplayNames[u.username] || u.username;
      requestingSelect.appendChild(option);
    });

    // Populate receiving user dropdown
    const receivingSelect = document.getElementById('receivingUser');
    users.forEach(u => {
      if (u.username !== user.username) { // Exclude current user
        const option = document.createElement('option');
        option.value = u.username;
        option.textContent = userDisplayNames[u.username] || u.username;
        receivingSelect.appendChild(option);
      }
    });
  } catch (error) {
    showError('Failed to load users');
    console.error(error);
  } finally {
    showLoading(false);
  }

  // Form submission
  document.getElementById('requestForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('submitBtnText');
    const errorEl = document.getElementById('requestError');

    try {
      showLoading(true);
      btn.disabled = true;
      btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      await apiRequest('/api/requests', 'POST', {
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
      console.error(error);
    } finally {
      showLoading(false);
      btn.disabled = false;
      btnText.textContent = 'Submit Request';
    }
  });
});
