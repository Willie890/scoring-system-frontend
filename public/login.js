import { login } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // UI feedback
    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      // Attempt login
      const result = await login(username, password);
      
      // Store auth data
      localStorage.setItem('token', result.token);
      localStorage.setItem('loggedInUser', JSON.stringify({
        username: result.user.username,
        role: result.user.role
      }));
      
      // Redirect based on role
      window.location.href = result.user.role === 'admin' 
        ? 'admin_home.html' 
        : 'user_home.html';
        
    } catch (error) {
      // Handle errors
      console.error('Login error:', error);
      
      // User-friendly error messages
      let errorMessage = error.message || 'Login failed. Please try again.';
      
      if (error.message.includes('Network error')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message.includes('credentials')) {
        errorMessage = 'Invalid username or password';
      }
      
      errorEl.textContent = errorMessage;
      errorEl.style.display = 'block';
      
    } finally {
      // Reset UI
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  // Optional: Network status indicator
  function updateNetworkStatus() {
    const statusEl = document.getElementById('network-status');
    if (statusEl) {
      statusEl.textContent = navigator.onLine 
        ? '🟢 Online' 
        : '🔴 Offline - Check your connection';
    }
  }

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();
});



