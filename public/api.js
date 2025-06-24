const API_BASE = 'https://your-render-app-url.onrender.com/api'; // Replace with your Render app URL

function getToken() {
  return localStorage.getItem('token');
}

// Helper function for API requests
async function makeRequest(url, method = 'GET', body = null, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${url}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Auth
export async function login(username, password) {
  try {
    return await makeRequest('/auth/login', 'POST', { username, password }, false);
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
}

export async function logout() {
  // This is just client-side cleanup since JWT is stateless
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUser');
  return { success: true };
}

// Scores
export async function getScores() {
  try {
    const data = await makeRequest('/leaderboard');
    // Transform the data to match the format your frontend expects
    const scores = {};
    data.users.forEach(user => {
      scores[user.username] = user.score;
    });
    return scores;
  } catch (error) {
    console.error('Error getting scores:', error);
    throw error;
  }
}

export async function updateScores(username, points, reason, notes) {
  try {
    return await makeRequest('/leaderboard/update', 'POST', { username, points, reason, notes });
  } catch (error) {
    console.error('Error updating scores:', error);
    throw error;
  }
}

// History
export async function getHistory(filters = {}) {
  try {
    // Convert filters to query parameters
    const queryParams = new URLSearchParams();
    if (filters.user) queryParams.append('user', filters.user);
    if (filters.reason) queryParams.append('reason', filters.reason);
    if (filters.date) queryParams.append('date', filters.date);
    
    const data = await makeRequest(`/history?${queryParams.toString()}`);
    return data.history;
  } catch (error) {
    console.error('Error getting history:', error);
    throw error;
  }
}

// Requests (for notifications)
export async function getRequests() {
  try {
    const data = await makeRequest('/requests');
    return data.requests;
  } catch (error) {
    console.error('Error getting requests:', error);
    throw error;
  }
}

export async function handleRequest(requestId, approve) {
  try {
    return await makeRequest(`/requests/${requestId}/handle`, 'POST', { approve });
  } catch (error) {
    console.error('Error handling request:', error);
    throw error;
  }
}

export async function createRequest(request) {
  try {
    return await makeRequest('/requests', 'POST', request);
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
}

// Settings/admin
export async function getUsers() {
  try {
    const data = await makeRequest('/users');
    return data.users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

export async function changePassword(username, newPassword) {
  try {
    return await makeRequest(`/users/${encodeURIComponent(username)}/password`, 'POST', { newPassword });
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

export async function resetPoints() {
  try {
    return await makeRequest('/admin/reset-points', 'POST');
  } catch (error) {
    console.error('Error resetting points:', error);
    throw error;
  }
}

export async function resetHistory() {
  try {
    return await makeRequest('/admin/reset-history', 'POST');
  } catch (error) {
    console.error('Error resetting history:', error);
    throw error;
  }
}

export async function resetAll() {
  try {
    return await makeRequest('/admin/reset-all', 'POST');
  } catch (error) {
    console.error('Error resetting all:', error);
    throw error;
  }
}