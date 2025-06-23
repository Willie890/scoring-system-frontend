const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

// Enhanced error handling
async function handleResponse(response) {
  if (!response.ok) {
    // Try to get error details from response
    const error = await response.json().catch(() => ({
      message: `Request failed with status ${response.status}`
    }));
    
    // Special handling for CORS and network errors
    if (response.status === 0 || error.message.includes('Failed to fetch')) {
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

// Centralized fetch function
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

// Leaderboard Functions
export async function getLeaderboard() {
  try {
    const response = await apiFetch('/leaderboard');
    
    // Handle both array and object responses
    if (Array.isArray(response)) {
      return response;
    } else if (response && response.users) {
      return response.users;
    }
    
    throw new Error('Unexpected leaderboard format');
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    throw error;
  }
}

// Score Management
export async function updateScore(username, points, reason, notes = '') {
  return apiFetch('/scores/update', 'POST', {
    username,
    points: Number(points),
    reason,
    notes
  });
}

// History Functions
export async function logHistory(entry) {
  return apiFetch('/history', 'POST', {
    user: entry.username,
    points: entry.points,
    reason: entry.reason,
    notes: entry.notes || '',
    action: 'points_adjustment'
  });
}

export async function getHistory() {
  return apiFetch('/history');
}

// User Management
export async function getUsers() {
  return apiFetch('/users');
}

export async function changePassword(username, newPassword) {
  return apiFetch(`/users/${username}/password`, 'POST', { newPassword });
}

// Admin Functions
export async function resetPoints() {
  return apiFetch('/admin/reset-points', 'POST');
}

export async function resetHistory() {
  return apiFetch('/admin/reset-history', 'POST');
}

export async function resetAll() {
  return apiFetch('/admin/reset-all', 'POST');
}

// Request Functions
export async function getRequests() {
  return apiFetch('/requests');
}

export async function handleRequest(requestId, action) {
  return apiFetch(`/requests/${requestId}/handle`, 'POST', { 
    action: action ? 'approve' : 'reject' 
  });
}

export async function createRequest(request) {
  return apiFetch('/requests', 'POST', request);
}

// Auth Functions
export async function login(username, password) {
  return apiFetch('/auth/login', 'POST', { username, password });
}

// System Functions
export async function checkHealth() {
  return apiFetch('/health');
}

// Initialize connection
export async function initialize() {
  try {
    const health = await checkHealth();
    console.log('API connected:', health);
    return true;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
}

// Test connection on load
initialize();
