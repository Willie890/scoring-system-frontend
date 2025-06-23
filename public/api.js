// api.js - Complete non-module version
const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

// 1. Error Handling Function
function handleResponse(response) {
  if (!response.ok) {
    return response.json().then(function(error) {
      if (response.status === 0) {
        throw new Error(
          'Network error. Please:\n' +
          '1. Check your internet connection\n' +
          '2. Ensure backend is running\n' +
          '3. Contact support if issue persists'
        );
      }
      throw new Error(error.message || 'Request failed with status ' + response.status);
    }).catch(function() {
      throw new Error('Request failed with status ' + response.status);
    });
  }
  return response.json();
}

// 2. Main API Fetch Function
function apiFetch(endpoint, method, body) {
  var token = localStorage.getItem('token');
  var headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  var config = {
    method: method || 'GET',
    headers: headers,
    credentials: 'include'
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(API_BASE + endpoint, config)
    .then(handleResponse)
    .catch(function(error) {
      console.error('API request failed:', error);
      throw error;
    });
}

// 3. Leaderboard Functions
function getLeaderboard() {
  return apiFetch('/leaderboard').then(function(response) {
    return Array.isArray(response) ? response : response.users || [];
  });
}

function updateScore(username, points, reason, notes) {
  return apiFetch('/scores/update', 'POST', {
    username: username,
    points: Number(points),
    reason: reason,
    notes: notes || ''
  });
}

// 4. History Functions
function logHistory(entry) {
  return apiFetch('/history', 'POST', {
    user: entry.username,
    points: entry.points,
    reason: entry.reason,
    notes: entry.notes || '',
    action: 'points_adjustment',
    admin: entry.admin
  });
}

function getHistory() {
  return apiFetch('/history');
}

// 5. User Functions
function getUsers() {
  return apiFetch('/users');
}

function changePassword(username, newPassword) {
  return apiFetch('/users/' + username + '/password', 'POST', {
    newPassword: newPassword
  });
}

// 6. Admin Functions
function resetPoints() {
  return apiFetch('/admin/reset-points', 'POST');
}

function resetHistory() {
  return apiFetch('/admin/reset-history', 'POST');
}

function resetAll() {
  return apiFetch('/admin/reset-all', 'POST');
}

// 7. Request Functions
function getRequests() {
  return apiFetch('/requests');
}

function handleRequest(requestId, approve) {
  return apiFetch('/requests/' + requestId + '/handle', 'POST', {
    approve: approve
  });
}

function createRequest(request) {
  return apiFetch('/requests', 'POST', request);
}

// 8. Auth Functions
function login(username, password) {
  return apiFetch('/auth/login', 'POST', {
    username: username,
    password: password
  });
}

// 9. System Functions
function checkHealth() {
  return apiFetch('/health');
}

// 10. Initialize API (self-executing)
(function initialize() {
  checkHealth().then(function() {
    console.log('API connection successful');
  }).catch(function(error) {
    console.error('API connection failed:', error);
  });
})();

// 11. Export to global scope
window.LeaderboardAPI = {
  getLeaderboard: getLeaderboard,
  updateScore: updateScore,
  logHistory: logHistory,
  getHistory: getHistory,
  getUsers: getUsers,
  changePassword: changePassword,
  resetPoints: resetPoints,
  resetHistory: resetHistory,
  resetAll: resetAll,
  getRequests: getRequests,
  handleRequest: handleRequest,
  createRequest: createRequest,
  login: login,
  checkHealth: checkHealth
};
