import { login } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
      const result = await login(username, password);
      
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('loggedInUser', JSON.stringify(result.user));
        window.location.href = result.user.role === 'admin' ? 'admin_home.html' : 'user_home.html';
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      errorEl.textContent = error.message || 'Login failed. Please try again.';
      console.error('Login error:', error);
    }
  });
});



