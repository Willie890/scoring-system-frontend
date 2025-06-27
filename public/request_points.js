document.addEventListener('DOMContentLoaded', async function() {
  // Get logged in user
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    logout();
    return;
  }

  // Load all users from both users API and leaderboard
  try {
    showLoading(true);
    
    // Fetch all users and scores in parallel
    const [usersResponse, scoresResponse] = await Promise.all([
      apiRequest('/api/users'),
      apiRequest('/api/leaderboard')
    ]);
    
    const allUsers = usersResponse.users;
    const scores = scoresResponse.users;
    
    // Create a mapping of usernames to display names
    const userMap = {};
    scores.forEach(score => {
      userMap[score.username] = score.username; // Use username as display name
    });

    // Populate requesting user dropdown
    const requestingSelect = document.getElementById('requestingUser');
    allUsers.forEach(u => {
      const option = document.createElement('option');
      option.value = u.username;
      option.textContent = userMap[u.username] || u.username;
      requestingSelect.appendChild(option);
    });

    // Set default requesting user to current user
    requestingSelect.value = user.username;
    
    // Populate receiving user dropdown (excluding current user)
    const receivingSelect = document.getElementById('receivingUser');
    allUsers.forEach(u => {
      if (u.username !== user.username) {
        const option = document.createElement('option');
        option.value = u.username;
        option.textContent = userMap[u.username] || u.username;
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
      // Reset to current user as requester
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
