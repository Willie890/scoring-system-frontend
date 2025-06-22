const API_BASE = 'https://scoring-system-9yqb.onrender.com/api';

// Application data
const appUsers = [
  'Jp Faber', 'Stefan van Der Merwe', 'Ewan Van Eeden',
  'Frikkie Van Der Heever', 'Carlo Engela', 'Zingisani Mavumengwana',
  'Hlobelo Serathi', 'Prince Moyo', 'Patrick Mokotoamane'
];

const presetReasons = [
  'Improvement Initiative', '3S Adherence', 'Preventative Maintenance',
  'Defect Reduction', 'Efficiency Gains', 'Skill Development',
  'Kaizen Suggestion', 'Team Contribution', 'Tooling Return Failure',
  'Kiosk Misconduct', 'Rework or Delay', 'Maintenance Checklist failure',
  'Safety Violations', 'Tool Breakage'
];

// Enhanced logout function
window.logout = async function(e) {
  if (e) e.preventDefault();
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/index.html';
  }
};

// Token verification
async function verifyToken() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

// Token refresh
async function refreshToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      window.location.href = '/index.html';
      return null;
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

// Initialize authentication check
document.addEventListener('DOMContentLoaded', async function() {
  const protectedPages = [
    'admin_home.html', 'user_home.html', 
    'history.html', 'settings.html', 
    'request_points.html'
  ];
  
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    const token = localStorage.getItem('token');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    
    // Verify token or attempt refresh
    let isValidToken = await verifyToken();
    if (!isValidToken) {
      const newToken = await refreshToken();
      isValidToken = newToken !== null;
    }
    
    if (!token || !loggedInUser || !isValidToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      window.location.href = '/index.html';
      return;
    }
    
    // Role-based access control
    if (['admin_home.html', 'settings.html'].includes(currentPage)) {
      if (loggedInUser.role !== 'admin') {
        window.location.href = '/index.html';
      }
    }
  }
});

// API helper function
async function makeAuthenticatedRequest(url, method = 'GET', body = null) {
  let token = localStorage.getItem('token');
  
  // Try to refresh token if request fails
  const attemptRequest = async (attempt = 1) => {
    try {
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${API_BASE}${url}`, options);
      
      if (response.status === 401 && attempt === 1) {
        // Token might be expired, try to refresh
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
          return attemptRequest(2); // Retry with new token
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };
  
  return attemptRequest();
}
