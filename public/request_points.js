document.addEventListener("DOMContentLoaded", function() {
    // Initialize form with user data
    const nameSelect = document.getElementById("receivingUser");
    const users = [
        "Jp Faber",
        "Stefan van Der Merwe",
        "Ewan Van Eeden",
        "Frikkie Van Der Heever",
        "Carlo Engela",
        "Zingisani Mavumengwana",
        "Hlobelo Serathi",
        "Prins Moyo",
        "Patrick Mokotoamane"
    ];

    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        option.textContent = user;
        nameSelect.appendChild(option);
    });

    // Set requesting user to logged in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        document.getElementById("requestingUser").value = loggedInUser.username;
    }

    // Form submission
    document.getElementById("requestForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const requestingUser = document.getElementById("requestingUser").value;
        const receivingUser = document.getElementById("receivingUser").value;
        const points = parseInt(document.getElementById("points").value);
        const reason = document.getElementById("reason").value;
        const additionalNotes = document.getElementById("additionalNotes").value;

        if (!requestingUser || !receivingUser || isNaN(points) || !reason) {
            showError("Please fill all required fields");
            return;
        }

        try {
            showLoading(true);
            await apiRequest('/api/requests', 'POST', {
                receivingUser,
                points,
                reason,
                additionalNotes
            });
            
            showSuccess("Request submitted successfully!");
            document.getElementById("requestForm").reset();
            
            // Reset requesting user to logged in user
            if (loggedInUser) {
                document.getElementById("requestingUser").value = loggedInUser.username;
            }
        } catch (error) {
            console.error("Request error:", error);
            showError("Failed to submit request");
        } finally {
            showLoading(false);
        }
    });
});
