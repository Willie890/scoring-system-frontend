document.addEventListener('DOMContentLoaded', async function() {
  // Get logged in user
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    logout();
    return;
  }

  // Set requesting user
  document.getElementById('requestingUser').value = user.username;

  // Load other users
  try {
    showLoading(true);
    const { users } = await apiRequest('/api/users');
    
    const select = document.getElementById('receivingUser');
    users.forEach(u => {
      if (u.username !== user.username) {
        const option = document.createElement('option');
        option.value = u.username;
        option.textContent = u.username;
        select.appendChild(option);
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
