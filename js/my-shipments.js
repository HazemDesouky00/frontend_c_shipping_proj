// my_shipments.js

// 1. Read token
const token = localStorage.getItem("token");

// If not logged in, redirect
if (!token) {
    window.location.href = "login.html";
}

const shipmentsList = document.getElementById("shipmentsList");
const sendingBtn = document.getElementById("filterSending");
const receivingBtn = document.getElementById("filterReceiving");

let allShipments = [];
let currentUserId = null;

// 2. Load user + shipments
async function loadShipments() {
    try {
        // ---- get user profile (to know user ID)
        const userRes = await fetch("http://localhost:3000/users/me", {
            method:"GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const userData = await userRes.json();

        if (!userRes.ok) {
            window.location.href = "login.html";
            return;
        }

        currentUserId = userData.user.ID;

        // ---- get shipments
        const res = await fetch("http://localhost:3000/shipments/mine", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();

        if (!res.ok) {
            shipmentsList.innerText = "Error loading shipments.";
            return;
        }

        allShipments = data.shipments;

        // default  show sending
        showSending();

    } catch (err) {
        console.error(err);
        shipmentsList.innerText = "Server error.";
    }
}

// 3. Render shipments
function renderShipments(list) {
    shipmentsList.innerText = "";

    if (list.length === 0) {
        shipmentsList.innerText = "No shipments found.";
        return;
    }

    list.forEach(shipment => {
        const card = document.createElement("div");
        card.className = "shipment-card";

        const title = document.createElement("h3");
        title.innerText = `Tracking: ${shipment.TRACKINGNUMBER}`;

        const status = document.createElement("p");
        status.innerText = `Status: ${shipment.STATUS}`;

        const from = document.createElement("p");
        from.innerText = `From: ${shipment.ORIGINCOUNTRY}`;

        const to = document.createElement("p");
        to.innerText = `To: ${shipment.DESTINATIONCOUNTRY}`;

        const date = document.createElement("p");
        date.innerText = `Date: ${shipment.CREATEDAT}`;

        card.appendChild(title);
        card.appendChild(status);
        card.appendChild(from);
        card.appendChild(to);
        card.appendChild(date);

        shipmentsList.appendChild(card);
    });
}

// 4. filter logic 
function showSending() {
    sendingBtn.classList.add("active-filter");
    receivingBtn.classList.remove("active-filter");

    const sending = allShipments.filter(
        s => s.SENDERID === currentUserId
    );

    renderShipments(sending);
}

function showReceiving() {
    receivingBtn.classList.add("active-filter");
    sendingBtn.classList.remove("active-filter");

    const receiving = allShipments.filter(
        s => s.RECEIVERID === currentUserId
    );

    renderShipments(receiving);
}

// 5. Button listeners
sendingBtn.addEventListener("click", showSending);
receivingBtn.addEventListener("click", showReceiving);

// Init
loadShipments();
