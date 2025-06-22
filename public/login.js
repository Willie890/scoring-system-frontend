import { login } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('loginError');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous errors
    errorElement.textContent = '';
    
    // Validate inputs
    if (!username || !password) {
      errorElement.textContent = 'Please enter both username and password';
      return;
    }
    
    try {
      // Show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Logging in...';
      
      // Attempt login
      const result = await login(username, password);
      
      if (result.success) {
        // Store authentication data
        localStorage.setItem('token', result.token);
        localStorage.setItem('loggedInUser', JSON.stringify(result.user));
        
        // Redirect based on role
        window.location.href = result.user.role === 'admin' 
          ? '/admin_home.html' 
          : '/user_home.html';
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      errorElement.textContent = error.message || 'Login failed. Please try again.';
      passwordInput.value = '';
      
      // Restore button state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
});




