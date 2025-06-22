const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
};

export const getScores = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/leaderboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await handleResponse(response);
  return data.users.reduce((acc, user) => {
    acc[user.username] = user.score;
    return acc;
  }, {});
};

export const updateScores = async (username, points, reason, notes) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/leaderboard/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, points, reason, notes })
  });
  return handleResponse(response);
};

export const getHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/history`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const getRequests = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/requests`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const handleRequest = async (requestId, approve) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/requests/${requestId}/handle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ approve })
  });
  return handleResponse(response);
};

export const createRequest = async (request) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });
  return handleResponse(response);
};

export const getUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const changePassword = async (username, newPassword) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/users/${username}/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ newPassword })
  });
  return handleResponse(response);
};

export const resetPoints = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/admin/reset-points`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const resetHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/admin/reset-history`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const resetAll = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/admin/reset-all`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
