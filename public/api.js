const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function getScores() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/leaderboard`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  const data = await handleResponse(response);
  const scoresMap = {};
  data.users.forEach(user => {
    scoresMap[user.username] = user.score;
  });
  return scoresMap;
}

export async function updateScores(username, points, reason, notes) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/leaderboard/update`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, points: Number(points), reason, notes: notes || '' }),
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function getHistory() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/history`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function getRequests() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/requests`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function handleRequest(requestId, approve) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/requests/${requestId}/handle`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ approve }),
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function createRequest(request) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request),
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function getUsers() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/users`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function changePassword(username, newPassword) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/users/${username}/password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newPassword }),
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function resetPoints() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/admin/reset-points`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function resetHistory() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/admin/reset-history`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
}

export async function resetAll() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/admin/reset-all`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return handleResponse(response);
}
