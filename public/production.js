document.addEventListener('DOMContentLoaded', async function() {
  // Set home link based on role
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  document.getElementById('homeLink').href = user?.role === 'admin' 
    ? 'admin_home.html' 
    : 'user_home.html';

  // Set default date to today
  document.getElementById('filterDate').valueAsDate = new Date();

  // Load initial history
  await loadProductionHistory();

  // Form submission
  document.getElementById('productionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    
    try {
      showLoading(true);
      btn.disabled = true;
      
      await apiRequest('/api/production', 'POST', {
        workorder: document.getElementById('workorder').value,
        quantity: parseInt(document.getElementById('quantity').value),
        machine: document.getElementById('machine').value,
        operation: document.getElementById('operation').value,
        rejects: parseInt(document.getElementById('rejects').value),
        notes: document.getElementById('notes').value || undefined
      });

      showSuccess('Production entry saved successfully!');
      this.reset();
      await loadProductionHistory();
    } catch (error) {
      showError(error.message || 'Failed to save production entry');
      console.error('Production submission error:', error);
    } finally {
      showLoading(false);
      btn.disabled = false;
    }
  });
});

async function loadProductionHistory() {
  try {
    showLoading(true);
    const date = document.getElementById('filterDate').value;
    const workorder = document.getElementById('filterWorkorder').value;
    
    const { history } = await apiRequest(
      `/api/production/history?${date ? `date=${date}` : ''}${workorder ? `&workorder=${workorder}` : ''}`
    );
    
    const tbody = document.getElementById('productionHistoryBody');
    
    if (!history || history.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="no-data">No production history found</td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = history.map(entry => {
      const rejectRate = ((entry.rejects / entry.quantity) * 100).toFixed(2);
      return `
        <tr>
          <td>${new Date(entry.date).toLocaleDateString()}</td>
          <td>${entry.workorder}</td>
          <td>${entry.quantity}</td>
          <td>${entry.machine}</td>
          <td>${entry.operation}</td>
          <td>${entry.rejects}</td>
          <td class="${rejectRate > 5 ? 'reject-rate' : ''}">${rejectRate}%</td>
          <td>${entry.notes || '-'}</td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    showError('Failed to load production history');
    console.error('Production history error:', error);
  } finally {
    showLoading(false);
  }
}

function resetProductionFilters() {
  document.getElementById('filterDate').valueAsDate = new Date();
  document.getElementById('filterWorkorder').value = '';
  loadProductionHistory();
   // Validate dropdowns
  const machine = document.getElementById('machine').value;
  const operation = document.getElementById('operation').value;
  
  if (!machine) {
    showError('Please select a machine');
    return;
  }
  
  if (!operation) {
    showError('Please select an operation');
    return;
  }

  const btn = this.querySelector('button[type="submit"]');
  
  try {
    showLoading(true);
    btn.disabled = true;
    
    await apiRequest('/api/production', 'POST', {
      workorder: document.getElementById('workorder').value,
      quantity: parseInt(document.getElementById('quantity').value),
      machine: machine,
      operation: operation,
      rejects: parseInt(document.getElementById('rejects').value),
      notes: document.getElementById('notes').value || undefined
    });

    showSuccess('Production entry saved successfully!');
    this.reset();
    await loadProductionHistory();
  } catch (error) {
    showError(error.message || 'Failed to save production entry');
    console.error('Production submission error:', error);
  } finally {
    showLoading(false);
    btn.disabled = false;
  }
});
}

function updateNotificationBadge() {
  // This would be called after successful submission
  // Implementation depends on your notification system
  console.log('New production entry added - update notifications');
}
