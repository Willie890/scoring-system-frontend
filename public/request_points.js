document.addEventListener('DOMContentLoaded', async function() {
  // Get logged in user
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    logout();
    return;
  }

  try {
    showLoading(true);
    
    // Fetch leaderboard data to get all user names
    const { users: leaderboardUsers } = await apiRequest('/api/leaderboard');
    
    // Create user options from leaderboard data
    const requestingSelect = document.getElementById('requestingUser');
    const receivingSelect = document.getElementById('receivingUser');
    
    // Clear existing options
    requestingSelect.innerHTML = '<option value="">Select requester</option>';
    receivingSelect.innerHTML = '<option value="">Select recipient</option>';
    
    // Populate dropdowns with names from the leaderboard
    leaderboardUsers.forEach(userData => {
      // Add to requesting user dropdown
      const requestOption = document.createElement('option');
      requestOption.value = userData.username;
      requestOption.textContent = userData.username; // Using username as display name
      requestingSelect.appendChild(requestOption);
      
      // Add to receiving user dropdown (excluding current user)
      if (userData.username !== user.username) {
        const receiveOption = document.createElement('option');
        receiveOption.value = userData.username;
        receiveOption.textContent = userData.username;
        receivingSelect.appendChild(receiveOption);
      }
    });
    
    // Set default requesting user to current user
    requestingSelect.value = user.username;

  } catch (error) {
    showError('Failed to load user data');
    console.error(error);
  } finally {
    showLoading(false);
  }

  // Rest of your form submission code remains the same
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
