// login.js - Traditional JS version
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorDisplay = document.getElementById('errorDisplay');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    // UI Feedback
    errorDisplay.textContent = '';
    errorDisplay.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    LeaderboardAPI.login(username, password)
      .then(function(response) {
        // Redirect based on role
        if (response.user.role === 'admin') {
          window.location.href = 'admin_home.html';
        } else {
          window.location.href = 'user_home.html';
        }
      })
      .catch(function(error) {
        errorDisplay.textContent = error.message || 'Login failed. Please try again.';
        errorDisplay.style.display = 'block';
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      });
  });
});



