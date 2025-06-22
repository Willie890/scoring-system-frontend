export const appUsers = [
  'Jp Faber', 'Stefan van Der Merwe', 'Ewan Van Eeden',
  'Frikkie Van Der Heever', 'Carlo Engela', 'Zingisani Mavumengwana',
  'Hlobelo Serathi', 'Prince Moyo', 'Patrick Mokotoamane'
];

export const presetReasons = [
  'Improvement Initiative', '3S Adherence', 'Preventative Maintenance',
  'Defect Reduction', 'Efficiency Gains', 'Skill Development',
  'Kaizen Suggestion', 'Team Contribution', 'Tooling Return Failure',
  'Kiosk Misconduct', 'Rework or Delay', 'Maintenance Checklist failure', 
  'Safety Violations', 'Tool Breakage'
];

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
};

export const checkAuth = () => {
  const protectedPages = ['admin_home.html', 'user_home.html', 'history.html', 'settings.html', 'request_points.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    
    if (!token || !user.username) {
      window.location.href = 'index.html';
      return;
    }

    if (['admin_home.html', 'settings.html'].includes(currentPage) && user.role !== 'admin') {
      window.location.href = 'index.html';
    }
  }
};

document.addEventListener('DOMContentLoaded', checkAuth);
