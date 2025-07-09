document.addEventListener('DOMContentLoaded', async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const productionId = urlParams.get('id');

  if (!productionId) {
    window.location.href = 'notifications.html';
    return;
  }

  try {
    showLoading(true);
    const { productionEntry } = await apiRequest(`/api/production/${productionId}`);
    
    document.getElementById('productionDetails').innerHTML = `
      <div class="detail-item">
        <span class="detail-label">Workorder:</span>
        <span class="detail-value">${productionEntry.workorder}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Quantity:</span>
        <span class="detail-value">${productionEntry.quantity}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Machine:</span>
        <span class="detail-value">${productionEntry.machine}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Operation:</span>
        <span class="detail-value">${productionEntry.operation}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Rejects:</span>
        <span class="detail-value">${productionEntry.rejects}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Reject Rate:</span>
        <span class="detail-value">${((productionEntry.rejects / productionEntry.quantity) * 100).toFixed(2)}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Submitted By:</span>
        <span class="detail-value">${productionEntry.user}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${new Date(productionEntry.date).toLocaleString()}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Notes:</span>
        <span class="detail-value">${productionEntry.notes || 'None'}</span>
      </div>
    `;
  } catch (error) {
    showError('Failed to load production details');
    console.error(error);
  } finally {
    showLoading(false);
  }
});
