const appUsers = [
  'Jp Faber',
  'Stefan van Der Merwe',
  'Ewan Van Eeden',
  'Frikkie Van Der Heever',
  'Carlo Engela',
  'Zingisani Mavumengwana',
  'Hlobelo Serathi',
  'Prince Moyo',
  'Patrick Mokotoamane'
];

const presetReasons = [
  'Improvement Initiative',
  '3S Adherence',
  'Preventative Maintenance',
  'Defect Reduction',
  'Efficiency Gains',
  'Skill Development',
  'Kaizen Suggestion',
  'Team Contribution',
  'Tooling Return Failure',
  'Kiosk Misconduct',
  'Rework or Delay',
  'Maintenance Checklist failure',
  'Safety Violations',
  'Tool Breakage'
];

// Enhanced logout function
window.logout = async function(e) {
  if (e) e.preventDefault();
  try {
    await logout();
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = 'index.html';
  }
};

// Initialize authentication check
document.addEventListener('DOMContentLoaded', function() {
  const protectedPages = ['admin_home.html', 'user_home.html', 'history.html', 'settings.html', 'request_points.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = localStorage.getItem('token');
    
    if (!loggedInUser || !token) {
      window.location.href = 'index.html';
    }
  }
});