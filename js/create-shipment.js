// create_shipment.js

// Get token from localStorage
const token = localStorage.getItem("token");

// If no token → redirect to login
if (!token) {
    window.location.href = "login.html";
}

// Handle Create Shipment button
document.querySelector(".create-ship-btn").addEventListener("click", async () => {

    // Read input values
    const receiverId = document.getElementById("receiverId").value.trim();
    const originCountry = document.getElementById("originCountry").value.trim();
    const destinationCountry = document.getElementById("destinationCountry").value.trim();
    const weight = document.getElementById("weight").value.trim();
    const size = document.getElementById("size").value;
    const deliveryType = document.getElementById("deliveryType").value;

    // Basic validation
    if (!receiverId || !originCountry || !destinationCountry || !weight || !size || !deliveryType) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/shipments/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                receiverId,
                originCountry,
                destinationCountry,
                weight,
                size,
                deliveryType
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert(`Shipment created! Tracking Number: ${data.trackingNumber}`);
            window.location.href = "home.html";
        } else {
            alert(data.message || "Failed to create shipment.");
        }

    } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
    }
});
