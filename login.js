import { login } from './api.js';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';

  try {
    const result = await login(username, password);
    
    if (result.success) {
      // Store token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('loggedInUser', JSON.stringify(result.user));
      
      // Redirect based on role
      window.location.href = result.user.role === 'admin' 
        ? 'admin_home.html' 
        : 'user_home.html';
    } else {
      throw new Error(result.message || 'Invalid credentials');
    }
  } catch (error) {
    errorEl.textContent = error.message || 'Login failed. Please try again.';
    document.getElementById('password').value = '';
  }
});




