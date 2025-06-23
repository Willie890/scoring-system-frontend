// api.js - Complete non-module version with all fixes
const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

// 1. Enhanced Error Handling
function handleResponse(response) {
  if (!response.ok) {
    return response.json().then(function(error) {
      // Special handling for CORS/network errors
      if (response.status === 0 || error.message.includes('Failed to fetch')) {
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

// 2. Main API Fetch Function with improved CORS handling
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
    credentials: 'include',
    mode: 'cors' // Explicitly enable CORS
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(API_BASE + endpoint, config)
    .then(handleResponse)
    .catch(function(error) {
      console.error('API request to ' + endpoint + ' failed:', error);
      throw error;
    });
}

// 3. Leaderboard Functions with improved data handling
function getLeaderboard() {
  return apiFetch('/leaderboard').then(function(response) {
    // Handle both array and object responses
    if (Array.isArray(response)) {
      return response;
    }
    return response.users || [];
  });
}

function updateScore(username, points, reason, notes) {
  return apiFetch('/scores/update', 'POST', {
    username: username,
    points: Number(points),
    reason: reason || 'Manual adjustment',
    notes: notes || ''
  }).then(function(response) {
    // Ensure consistent response format
    return response.success ? response : { success: true, ...response };
  });
}

// 4. History Functions with enhanced logging
function logHistory(entry) {
  var currentUser = JSON.parse(localStorage.getItem('loggedInUser') || {};
  return apiFetch('/history', 'POST', {
    user: entry.username,
    points: entry.points,
    reason: entry.reason || 'No reason provided',
    notes: entry.notes || '',
    action: entry.action || 'points_adjustment',
    admin: entry.admin || currentUser.username || 'system'
  });
}

// 5. User Management
function getUsers() {
  return apiFetch('/users').then(function(response) {
    return Array.isArray(response) ? response : response.users || [];
  });
}

function changePassword(username, newPassword) {
  return apiFetch('/users/' + username + '/password', 'POST', {
    newPassword: newPassword
  });
}

// 6. Admin Functions with confirmation
function resetPoints() {
  if (confirm('Are you sure you want to reset all points?')) {
    return apiFetch('/admin/reset-points', 'POST');
  }
  return Promise.reject(new Error('Reset canceled'));
}

function resetHistory() {
  if (confirm('Are you sure you want to reset history?')) {
    return apiFetch('/admin/reset-history', 'POST');
  }
  return Promise.reject(new Error('Reset canceled'));
}

function resetAll() {
  if (confirm('Are you sure you want to reset ALL data?')) {
    return apiFetch('/admin/reset-all', 'POST');
  }
  return Promise.reject(new Error('Reset canceled'));
}

// 7. Request Functions with status handling
function getRequests() {
  return apiFetch('/requests').then(function(response) {
    return Array.isArray(response) ? response : response.requests || [];
  });
}

function handleRequest(requestId, approve) {
  return apiFetch('/requests/' + requestId + '/handle', 'POST', {
    approve: approve
  });
}

function createRequest(request) {
  return apiFetch('/requests', 'POST', {
    receivingUser: request.receivingUser,
    points: Number(request.points),
    reason: request.reason || '',
    additionalNotes: request.additionalNotes || ''
  });
}

// 8. Auth Functions with token handling
function login(username, password) {
  return apiFetch('/auth/login', 'POST', {
    username: username,
    password: password
  }).then(function(response) {
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('loggedInUser', JSON.stringify(response.user || {}));
    }
    return response;
  });
}

// 9. System Health Check
function checkHealth() {
  return apiFetch('/health').then(function(response) {
    return {
      ok: response.status === 'ok',
      timestamp: new Date().toISOString()
    };
  });
}

// 10. Initialize API with retry logic
(function initialize() {
  function check() {
    checkHealth().then(function() {
      console.log('API connection successful');
    }).catch(function(error) {
      console.warn('API connection failed, retrying...', error);
      setTimeout(check, 5000); // Retry every 5 seconds
    });
  }
  check(); // Initial check
})();

// 11. Export to global scope with version info
window.LeaderboardAPI = {
  VERSION: '1.0.0',
  // Core Functions
  getLeaderboard: getLeaderboard,
  updateScore: updateScore,
  logHistory: logHistory,
  getHistory: getHistory,
  // User Management
  getUsers: getUsers,
  changePassword: changePassword,
  // Admin Functions
  resetPoints: resetPoints,
  resetHistory: resetHistory,
  resetAll: resetAll,
  // Request Handling
  getRequests: getRequests,
  handleRequest: handleRequest,
  createRequest: createRequest,
  // Auth
  login: login,
  logout: function() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
  },
  // System
  checkHealth: checkHealth
};
