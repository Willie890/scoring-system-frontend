document.addEventListener("DOMContentLoaded", function() {
    // Initialize form with user data
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

    const nameSelect = document.getElementById("receivingUser");
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
    document.getElementById("requestForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const requestingUser = document.getElementById("requestingUser").value;
        const receivingUser = document.getElementById("receivingUser").value;
        const points = parseInt(document.getElementById("points").value);
        const reason = document.getElementById("reason").value;
        const additionalNotes = document.getElementById("additionalNotes").value;

        if (!requestingUser || !receivingUser || isNaN(points) || !reason) {
            alert("Please fill all required fields");
            return;
        }

        const request = {
            requestingUser,
            receivingUser,
            points,
            reason,
            additionalNotes,
            status: "pending",
            timestamp: new Date().toISOString()
        };

        // Get existing requests or initialize empty array
        let requests = JSON.parse(localStorage.getItem("requests")) || [];
        requests.push(request);
        localStorage.setItem("requests", JSON.stringify(requests));

        alert("Request submitted successfully!");
        document.getElementById("requestForm").reset();
        
        // Reset requesting user to logged in user
        if (loggedInUser) {
            document.getElementById("requestingUser").value = loggedInUser.username;
        }
    });
});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}