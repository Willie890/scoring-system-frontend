document.addEventListener("DOMContentLoaded", async function() {
    try {
        showLoading(true);
        const response = await apiRequest('/api/requests');
        const requests = response.requests;
        const tableBody = document.querySelector("#notificationsTable tbody");
        
        if (requests.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">No pending requests</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = requests.map(request => `
            <tr>
                <td>${request.requestingUser}</td>
                <td>${request.receivingUser}</td>
                <td>${request.points}</td>
                <td>${request.reason}</td>
                <td class="notes-cell">${request.additionalNotes || ''}</td>
                <td>${request.status}</td>
                <td class="action-buttons">
                    <button class="approve-btn" onclick="handleRequest('${request._id}', true)">Approve</button>
                    <button class="reject-btn" onclick="handleRequest('${request._id}', false)">Reject</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Failed to load requests:", error);
        showError("Failed to load requests");
    } finally {
        showLoading(false);
    }
});

window.handleRequest = async function(requestId, approve) {
    if (!confirm(`Are you sure you want to ${approve ? 'approve' : 'reject'} this request?`)) {
        return;
    }

    try {
        showLoading(true);
        await apiRequest(`/api/requests/${requestId}/handle`, 'POST', { approve });
        showSuccess(`Request ${approve ? 'approved' : 'rejected'} successfully`);
        
        // Reload the requests
        const response = await apiRequest('/api/requests');
        const tableBody = document.querySelector("#notificationsTable tbody");
        tableBody.innerHTML = response.requests.map(request => `
            <tr>
                <td>${request.requestingUser}</td>
                <td>${request.receivingUser}</td>
                <td>${request.points}</td>
                <td>${request.reason}</td>
                <td class="notes-cell">${request.additionalNotes || ''}</td>
                <td>${request.status}</td>
                <td class="action-buttons">
                    <button class="approve-btn" onclick="handleRequest('${request._id}', true)">Approve</button>
                    <button class="reject-btn" onclick="handleRequest('${request._id}', false)">Reject</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Failed to handle request:", error);
        showError(`Failed to ${approve ? 'approve' : 'reject'} request`);
    } finally {
        showLoading(false);
    }
};
