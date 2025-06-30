const API_BASE_URL = 'https://scoring-system-9yqb.onrender.com';

// Authentication Helpers
window.checkAuth = function() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  
  if (!token && !window.location.pathname.includes('index.html')) {
    window.location.href = 'index.html';
    return false;
  }
  
  // Redirect admin trying to access user pages and vice versa
  if (window.location.pathname.includes("admin") && user?.role !== "admin") {
    window.location.href = "user_home.html";
    return false;
  }
  
  return true;
};

window.logout = function() {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
};

window.apiRequest = async function(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || 'Request failed');
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// UI Helpers
window.showLoading = function(show) {
  const loader = document.getElementById('loading-overlay') || document.createElement('div');
  loader.id = 'loading-overlay';
  loader.innerHTML = '<div class="spinner"></div>';
  loader.style.cssText = show ? `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); display: flex; justify-content: center;
    align-items: center; z-index: 9999;
  ` : 'display: none';
  if (show) document.body.appendChild(loader);
  else loader.remove();
};

window.showError = function(message) {
  const el = document.createElement('div');
  el.className = 'notification error';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 5000);
};

window.showSuccess = function(message) {
  const el = document.createElement('div');
  el.className = 'notification success';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 5000);
};

// Initialize auth check on all pages
document.addEventListener('DOMContentLoaded', function() {
  if (!window.location.pathname.includes('index.html')) {
    checkAuth();
  }
});
