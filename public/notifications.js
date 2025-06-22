import { getRequests, handleRequest } from './api.js';
import { logout } from './common.js';

window.logout = logout;

async function renderRequests() {
  try {
    const { requests } = await getRequests();
    const tbody = document.querySelector('#notificationsTable tbody');
    tbody.innerHTML = '';

    requests.filter(r => r.status === 'pending').forEach(request => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${request.requestingUser}</td>
        <td>${request.receivingUser}</td>
        <td>${request.points > 0 ? '+' + request.points : request.points}</td>
        <td>${request.reason}</td>
        <td>${request.additionalNotes || 'None'}</td>
        <td>pending</td>
        <td>
          <button class="approve-btn" data-id="${request._id}">Approve</button>
          <button class="reject-btn" data-id="${request._id}">Reject</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRequestAction(btn.dataset.id, true));
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRequestAction(btn.dataset.id, false));
    });
  } catch (error) {
    console.error('Error loading requests:', error);
    alert('Failed to load requests');
  }
}

async function handleRequestAction(requestId, approve) {
  try {
    const result = await handleRequest(requestId, approve);
    if (result.success) {
      alert(`Request ${approve ? 'approved' : 'rejected'}`);
      await renderRequests();
    } else {
      throw new Error(result.message || 'Action failed');
    }
  } catch (error) {
    console.error('Request action error:', error);
    alert(error.message || 'Failed to process request');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.role !== 'admin') {
    alert('Admin access required');
    window.location.href = 'index.html';
    return;
  }
  await renderRequests();
});
