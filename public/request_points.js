import { createRequest } from './api.js';
import { appUsers, logout } from './common.js';

window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('requestingUser').value = user.username;

  const receivingUserSelect = document.getElementById('receivingUser');
  appUsers.forEach(user => {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = user;
    receivingUserSelect.appendChild(option);
  });

  document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const request = {
      receivingUser: document.getElementById('receivingUser').value,
      points: parseInt(document.getElementById('points').value),
      reason: document.getElementById('reason').value,
      additionalNotes: document.getElementById('additionalNotes').value
    };

    try {
      const result = await createRequest(request);
      if (result.success) {
        alert('Request submitted successfully!');
        window.location.href = 'user_home.html';
      } else {
        throw new Error(result.message || 'Request failed');
      }
    } catch (error) {
      document.getElementById('requestMessage').textContent = error.message || 'Failed to submit request';
      console.error('Request error:', error);
    }
  });
});
