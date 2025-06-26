document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = document.getElementById('btnText');
  const errorEl = document.getElementById('loginError');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      showLoading(true);
      loginBtn.disabled = true;
      btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in';

      const { token, user } = await apiRequest('/api/auth/login', 'POST', { 
        username, 
        password 
      });
      
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      
      window.location.href = user.role === 'admin' ? 'admin_home.html' : 'user_home.html';
    } catch (error) {
      errorEl.textContent = error.message || 'Login failed. Please try again.';
      document.getElementById('password').value = '';
    } finally {
      showLoading(false);
      loginBtn.disabled = false;
      btnText.textContent = 'Login';
    }
  });
});
