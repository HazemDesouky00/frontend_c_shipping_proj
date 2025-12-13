// admin-shipments.js

// 1. Read token
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const list = document.getElementById("adminShipmentList");

// 2. Load all shipments
async function loadShipments() {
    try {
        const res = await fetch("http://localhost:3000/admin/shipments", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();

        if (!res.ok) {
            list.innerText = "Failed to load shipments.";
            return;
        }

        renderShipments(data.shipments);

    } catch (err) {
        console.error(err);
        list.innerText = "Server error.";
    }
}

// 3. Render shipments
function renderShipments(shipments) {
    list.innerText = "";

    if (shipments.length === 0) {
        list.innerText = "No shipments found.";
        return;
    }

    shipments.forEach(shipment => {
        const card = document.createElement("div");
        card.className = "shipment-card";

        const title = document.createElement("h3");
        title.innerText = `Tracking: ${shipment.TRACKINGNUMBER}`;

        const status = document.createElement("p");
        status.innerText = `Status: ${shipment.STATUS}`;

        const messageInput = document.createElement("input");
        messageInput.placeholder = "Admin message";

        const acceptBtn = document.createElement("button");
        acceptBtn.innerText = "Accept";

        const rejectBtn = document.createElement("button");
        rejectBtn.innerText = "Reject";

        acceptBtn.addEventListener("click", () => {
            updateStatus(shipment.ID, "ACCEPTED", messageInput.value);
        });

        rejectBtn.addEventListener("click", () => {
            updateStatus(shipment.ID, "REJECTED", messageInput.value);
        });

        card.appendChild(title);
        card.appendChild(status);
        card.appendChild(messageInput);
        card.appendChild(acceptBtn);
        card.appendChild(rejectBtn);
        list.appendChild(card);
    });
}

// 4. Update shipment status
async function updateStatus(id, status, message) {
    if (!message.trim()) {
        alert("Message is required.");
        return;
    }

    try {
        const res = await fetch(
            `http://localhost:3000/admin/shipments/${id}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ status, message })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Update failed.");
            return;
        }

        alert("Shipment updated.");
        loadShipments(); // refresh list

    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
}

// Init
loadShipments();
