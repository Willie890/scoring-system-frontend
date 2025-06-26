document.addEventListener('DOMContentLoaded', async function() {
  await loadRequests();

  // Refresh every 30 seconds
  setInterval(loadRequests, 30000);
});

async function loadRequests() {
  try {
    showLoading(true);
    const { requests } = await apiRequest('/api/requests?status=pending');
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
        <td>${req.requestingUser}</td>
        <td>${req.receivingUser}</td>
        <td>${req.points}</td>
        <td>${req.reason}</td>
        <td class="notes-cell">${req.additionalNotes || 'None'}</td>
        <td class="action-buttons">
          <button class="approve-btn" onclick="handleRequest('${req._id}', true)">Approve</button>
          <button class="reject-btn" onclick="handleRequest('${req._id}', false)">Reject</button>
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

window.handleRequest = async function(requestId, approve) {
  if (!confirm(`Are you sure you want to ${approve ? 'approve' : 'reject'} this request?`)) {
    return;
  }

  try {
    showLoading(true);
    await apiRequest(`/api/requests/${requestId}/handle`, 'POST', { approve });
    showSuccess(`Request ${approve ? 'approved' : 'rejected'} successfully`);
    await loadRequests();
  } catch (error) {
    showError(`Failed to ${approve ? 'approve' : 'reject'} request`);
    console.error(error);
  } finally {
    showLoading(false);
  }
};
