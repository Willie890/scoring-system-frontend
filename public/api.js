const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

// Get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Handle API response
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

// Auth API
export async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
}

export async function verifyToken() {
  const token = getToken();
  if (!token) return false;
  
  const response = await fetch(`${API_BASE}/auth/verify`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.ok;
}

export async function refreshToken() {
  const token = getToken();
  if (!token) return null;
  
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.href = '/index.html';
    return null;
  }
  
  return handleResponse(response);
}

// Leaderboard API
export async function getScores() {
  const response = await fetch(`${API_BASE}/leaderboard`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await handleResponse(response);
  return (data.users || []).reduce((acc, user) => {
    acc[user.username] = user.score;
    return acc;
  }, {});
}

export async function updateScores(username, points, reason, notes) {
  const response = await fetch(`${API_BASE}/leaderboard/update`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, points, reason, notes })
  });
  return handleResponse(response);
}

// History API
export async function getHistory(filters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.user) queryParams.append('user', filters.user);
  if (filters.reason) queryParams.append('reason', filters.reason);
  if (filters.date) queryParams.append('date', filters.date);
  
  const response = await fetch(`${API_BASE}/history?${queryParams.toString()}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

// Requests API
export async function getRequests() {
  const response = await fetch(`${API_BASE}/requests`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function createRequest(request) {
  const response = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  return handleResponse(response);
}

export async function handleRequest(requestId, approve) {
  const response = await fetch(`${API_BASE}/requests/${requestId}/handle`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ approve })
  });
  return handleResponse(response);
}

// Users API
export async function getUsers() {
  const response = await fetch(`${API_BASE}/users`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function changePassword(username, newPassword) {
  const response = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}/password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newPassword })
  });
  return handleResponse(response);
}

// Admin API
export async function resetPoints() {
  const response = await fetch(`${API_BASE}/admin/reset-points`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function resetHistory() {
  const response = await fetch(`${API_BASE}/admin/reset-history`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function resetAll() {
  const response = await fetch(`${API_BASE}/admin/reset-all`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}
