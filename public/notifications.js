let currentRequestId = null;
let currentApproveAction = false;
let currentTab = 'requests';

document.addEventListener('DOMContentLoaded', async function() {
  // Initialize tabs
  showTab('requests');
  
  // Set up tab switching
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      currentTab = this.getAttribute('onclick').match(/'(\w+)'/)[1];
      showTab(currentTab);
    });
  });
  
  // Load initial data
  await loadRequests();
  await loadProductionNotifications();
  
  // Refresh every 30 seconds
  setInterval(() => {
    if (currentTab === 'requests') loadRequests();
    if (currentTab === 'production') loadProductionNotifications();
  }, 30000);
});

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
    if (tab.id === `${tabName}Notifications`) {
      tab.classList.add('active');
    }
  });
}

async function loadRequests() {
  try {
    showLoading(true);
    const { requests } = await apiRequest('/api/requests?status=pending');
    updateNotificationBadge();
    
    const tbody = document.getElementById('requestsTableBody');
    
    if (!requests || requests.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="no-data">No pending requests</td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = requests.map(req => `
      <tr>
        <td>${escapeHtml(req.requestingUser)}</td>
        <td>${escapeHtml(req.receivingUser)}</td>
        <td>${req.points}</td>
        <td>${escapeHtml(req.reason)}</td>
        <td class="notes-cell" onclick="showNotesModal('${escapeHtml(req.additionalNotes || 'No additional notes')}')">
          ${req.additionalNotes ? escapeHtml(req.additionalNotes.substring(0, 20)) + (req.additionalNotes.length > 20 ? '...' : '') : 'None'}
        </td>
        <td class="action-buttons">
          <button class="approve-btn" onclick="prepareRequestResponse('${req._id}', true)">Approve</button>
          <button class="reject-btn" onclick="prepareRequestResponse('${req._id}', false)">Reject</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Load requests error:', error);
    showError('Failed to load requests. Please try again.');
  } finally {
    showLoading(false);
  }
}

async function loadProductionNotifications() {
  try {
    showLoading(true);
    const { notifications } = await apiRequest('/api/production/notifications');
    
    const tbody = document.getElementById('productionNotificationsBody');
    
    if (!notifications || notifications.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="no-data">No new production notifications</td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = notifications.map(notif => `
      <tr data-id="${notif._id}">
        <td>${notif.workorder}</td>
        <td>${notif.machine}</td>
        <td>${notif.operation}</td>
        <td>${notif.quantity}</td>
        <td>${notif.rejects}</td>
        <td>${new Date(notif.createdAt).toLocaleString()}</td>
        <td>
          <button onclick="markProductionNotificationRead('${notif._id}')">Mark Read</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Failed to load production notifications:', error);
    showError('Failed to load production notifications');
  } finally {
    showLoading(false);
  }
}

async function markProductionNotificationRead(id) {
  try {
    await apiRequest(`/api/production/notifications/${id}/mark-read`, 'POST');
    document.querySelector(`tr[data-id="${id}"]`).remove();
    updateNotificationBadge();
  } catch (error) {
    showError('Failed to mark notification as read');
    console.error('Error:', error);
  }
}

// ... rest of your notifications.js remains the same ...

function updateNotificationBadge(count) {
  const navLinks = document.querySelectorAll('a[href="notifications.html"]');
  navLinks.forEach(link => {
    let badge = link.querySelector('.notification-badge');
    
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.textContent = count;
        link.style.position = 'relative';
        link.appendChild(badge);
      } else {
        badge.textContent = count;
      }
    } else if (badge) {
      badge.remove();
    }
  });
}

window.showNotesModal = function(notes) {
  document.getElementById('modalNotesContent').textContent = notes;
  document.getElementById('notesModal').classList.remove('hidden');
};

window.closeNotesModal = function() {
  document.getElementById('notesModal').classList.add('hidden');
};

window.prepareRequestResponse = function(requestId, approve) {
  currentRequestId = requestId;
  currentApproveAction = approve;
  
  const modal = document.getElementById('responseModal');
  document.getElementById('responseModalTitle').textContent = 
    `${approve ? 'Approve' : 'Reject'} Request`;
  document.getElementById('adminNotes').value = '';
  modal.classList.remove('hidden');
};

window.closeResponseModal = function() {
  document.getElementById('responseModal').classList.add('hidden');
};

document.getElementById('confirmResponseBtn').addEventListener('click', async function() {
  if (!currentRequestId) return;
  
  const adminNotes = document.getElementById('adminNotes').value;
  
  try {
    showLoading(true);
    await apiRequest(`/api/requests/${currentRequestId}/handle`, 'POST', { 
      approve: currentApproveAction,
      adminNotes: adminNotes || undefined
    });
    
    showSuccess(`Request ${currentApproveAction ? 'approved' : 'rejected'} successfully`);
    closeResponseModal();
    await loadRequests();
  } catch (error) {
    showError(`Failed to ${currentApproveAction ? 'approve' : 'reject'} request`);
    console.error(error);
  } finally {
    showLoading(false);
  }
});

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  let currentTab = 'requests';

document.addEventListener('DOMContentLoaded', async function() {
  await loadRequests();
  await loadProductionNotifications();
  
  // Set up tab switching
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      currentTab = this.getAttribute('onclick').match(/'(\w+)'/)[1];
      showTab(currentTab);
    });
  });
  
  // Refresh every 30 seconds
  setInterval(() => {
    if (currentTab === 'requests') loadRequests();
    if (currentTab === 'production') loadProductionNotifications();
  }, 30000);
});

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.toggle('hidden', tab.id !== `${tabName}Notifications`);
    tab.classList.toggle('active', tab.id === `${tabName}Notifications`);
  });
}

// Add these functions to your existing notifications.js
async function loadProductionNotifications() {
  try {
    const { notifications } = await apiRequest('/api/production/notifications');
    const tbody = document.getElementById('productionNotificationsBody');
    
    tbody.innerHTML = notifications && notifications.length > 0 ?
      notifications.map(notif => `
        <tr data-id="${notif._id}">
          <td>${notif.workorder}</td>
          <td>${notif.machine}</td>
          <td>${notif.operation}</td>
          <td>${notif.quantity}</td>
          <td>${notif.rejects}</td>
          <td>${new Date(notif.createdAt).toLocaleString()}</td>
          <td>
            <button onclick="markProductionNotificationRead('${notif._id}')">Mark Read</button>
          </td>
        </tr>
      `).join('') : `
      <tr>
        <td colspan="7" class="no-data">No new production notifications</td>
      </tr>`;
  } catch (error) {
    console.error('Failed to load production notifications:', error);
  }
}

async function markProductionNotificationRead(id) {
  try {
    await apiRequest(`/api/production/notifications/${id}/mark-read`, 'POST');
    document.querySelector(`tr[data-id="${id}"]`).remove();
    updateNotificationBadge();
  } catch (error) {
    showError('Failed to mark notification as read');
    console.error('Error:', error);
  }
}

// Call this when loading the notifications page
loadProductionNotifications();

// Update the badge update function
async function updateNotificationBadges() {
  try {
    const [{ requests }, { notifications }] = await Promise.all([
      apiRequest('/api/requests?status=pending'),
      apiRequest('/api/production/notifications')
    ]);
    
    const totalNotifications = (requests?.length || 0) + (notifications?.length || 0);
    
    const badges = document.querySelectorAll('.notification-badge');
    badges.forEach(badge => {
      if (totalNotifications > 0) {
        badge.textContent = totalNotifications;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  } catch (error) {
    console.error('Failed to update badges:', error);
  }
}
}
