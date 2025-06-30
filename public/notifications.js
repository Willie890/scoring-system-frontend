let currentRequestId = null;
let currentApproveAction = false;

document.addEventListener('DOMContentLoaded', async function() {
  await loadRequests();
  // Refresh every 30 seconds
  setInterval(loadRequests, 30000);
});

async function loadRequests() {
  try {
    showLoading(true);
    const { requests } = await apiRequest('/api/requests?status=pending');
    updateNotificationBadge(requests.length);
    
    const tbody = document.getElementById('requestsTableBody');
    
    if (requests.length === 0) {
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
    showError('Failed to load requests');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

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
}
