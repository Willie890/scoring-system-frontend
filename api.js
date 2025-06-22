const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

function getToken() {
  return localStorage.getItem('token');
}

// Auth
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return await res.json();
}

// Scores
export async function getScores() {
  const res = await fetch(`${API_BASE}/leaderboard`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await res.json();
  return (data.users || []).reduce((acc, u) => {
    acc[u.username] = u.score;
    return acc;
  }, {});
}

export async function updateScores(username, points, reason, notes) {
  const res = await fetch(`${API_BASE}/leaderboard/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ username, points, reason, notes })
  });
  return await res.json();
}

// History
export async function getHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Requests (for notifications)
export async function getRequests() {
  const res = await fetch(`${API_BASE}/requests`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

export async function handleRequest(requestId, approve) {
  const res = await fetch(`${API_BASE}/requests/${requestId}/handle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ approve })
  });
  return await res.json();
}

// Create a new point request
export async function createRequest(request) {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(request)
  });
  return await res.json();
}

// Settings/admin
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

export async function changePassword(username, newPassword) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ newPassword })
  });
  return await res.json();
}

export async function resetPoints() {
  const res = await fetch(`${API_BASE}/admin/reset-points`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

export async function resetHistory() {
  const res = await fetch(`${API_BASE}/admin/reset-history`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

export async function resetAll() {
  const res = await fetch(`${API_BASE}/admin/reset-all`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}