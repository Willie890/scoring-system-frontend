const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

// Enhanced error handling
async function handleResponse(response) {
  if (!response.ok) {
    // Try to get error details from response
    const error = await response.json().catch(() => ({
      message: `Request failed with status ${response.status}`
    }));
    
    // Special handling for CORS errors
    if (response.status === 0) {
      throw new Error(
        'Network error. Please:\n' +
        '1. Check your internet connection\n' +
        '2. Ensure the backend service is running\n' +
        '3. Contact support if the issue persists'
      );
    }
    
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

// Common fetch configuration
async function apiFetch(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    credentials: 'include',
    mode: 'cors'
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
}

// API functions
export async function login(username, password) {
  return apiFetch('/auth/login', 'POST', { username, password });
}

export async function getLeaderboard() {
  const data = await apiFetch('/leaderboard');
  return data.users || [];
}

export async function updateScore(username, points, reason, notes) {
  return apiFetch('/scores/update', 'POST', {
    username,
    points: Number(points),
    reason,
    notes: notes || ''
  });
}

export async function logHistoryEntry(entryData) {
  return apiFetch('/history', 'POST', entryData);
}

export async function getHistory() {
  return apiFetch('/history');
}

export async function getRequests() {
  return apiFetch('/requests');
}

export async function handleRequest(requestId, approve) {
  return apiFetch(`/requests/${requestId}/handle`, 'POST', { approve });
}

export async function createRequest(request) {
  return apiFetch('/requests', 'POST', request);
}

export async function getUsers() {
  return apiFetch('/users');
}

export async function changePassword(username, newPassword) {
  return apiFetch(`/users/${username}/password`, 'POST', { newPassword });
}

export async function resetPoints() {
  return apiFetch('/admin/reset-points', 'POST');
}

export async function resetHistory() {
  return apiFetch('/admin/reset-history', 'POST');
}

export async function resetAll() {
  return apiFetch('/admin/reset-all', 'POST');
}

// Connection test utility
export async function testConnection() {
  try {
    await apiFetch('/health');
    console.log('API connection successful');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

// Initialize connection test
testConnection();
