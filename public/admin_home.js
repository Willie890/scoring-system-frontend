const PRESET_REASONS = [
  "Improvement Initiative", "3S Adherence", "Preventative Maintenance",
  "Defect Reduction", "Efficiency Gains", "Skill Development",
  "Kaizen Suggestion", "Team Contribution", "Tooling Return Failure",
  "Kiosk Misconduct", "Rework or Delay", "Safety Violations", "Tool Breakage"
];

document.addEventListener('DOMContentLoaded', function() {
  renderLeaderboard();
  setupPointAdjustment();
});

async function renderLeaderboard() {
  try {
    showLoading(true);
    const { users } = await apiRequest('/api/leaderboard');
    
    document.getElementById('scoreTableBody').innerHTML = users.map(user => `
      <tr>
        <td>${user.username}</td>
        <td class="point-buttons">
          ${[-50, -30, -20, -10,2, 5,7, 10, 20, 50].map(points => `
            <button onclick="showAdjustmentDialog('${user.username}', ${points})">
              ${points > 0 ? '+' + points : points}
            </button>
          `).join('')}
        </td>
        <td>${user.score}</td>
      </tr>
    `).join('');
  } catch (error) {
    showError('Failed to load leaderboard');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

function setupPointAdjustment() {
  window.showAdjustmentDialog = function(username, points) {
    document.getElementById('adjustUsername').textContent = username;
    document.getElementById('adjustPoints').textContent = points > 0 ? `+${points}` : points;
    document.getElementById('reasonSelect').innerHTML = `
      <option value="">Select reason</option>
      ${PRESET_REASONS.map(r => `<option value="${r}">${r}</option>`).join('')}
    `;
    document.getElementById('adjustNotes').value = '';
    document.getElementById('adjustmentDialog').classList.remove('hidden');
    window.currentAdjustment = { username, points };
  };

  window.closeAdjustmentDialog = function() {
    document.getElementById('adjustmentDialog').classList.add('hidden');
  };

  document.getElementById('submitAdjustment').addEventListener('click', async function() {
    const reason = document.getElementById('reasonSelect').value;
    const notes = document.getElementById('adjustNotes').value;
    
    if (!reason) {
      showError('Please select a reason');
      return;
    }

    try {
      showLoading(true);
      await apiRequest('/api/leaderboard/update', 'POST', {
        username: window.currentAdjustment.username,
        points: window.currentAdjustment.points,
        reason,
        notes: notes || "No additional notes"
      });
      
      closeAdjustmentDialog();
      await renderLeaderboard();
      showSuccess('Points updated successfully!');
    } catch (error) {
      showError('Failed to update points');
      console.error(error);
    } finally {
      showLoading(false);
    }
  });
}






