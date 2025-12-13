
// track_shipment.js to track current shipment status completely 

// 1. Read token
const token = localStorage.getItem("token");

// if not logged in , redirect
if (!token) {
    window.location.href = "login.html";
}

// Button click
document.getElementById("trackBtn").addEventListener("click", trackShipment);

async function trackShipment() {
    const trackingNumber = document.getElementById("trackingInput").value.trim();

    const errorBox = document.getElementById("trackError");
    const resultBox = document.getElementById("resultBox");
    const historyBox = document.getElementById("historyBox");
    const historyList = document.getElementById("historyList");

    // Reset UI
    errorBox.innerText = "";
    resultBox.classList.add("hidden");
    historyBox.classList.add("hidden");
    historyList.innerHTML = "";

    if (!trackingNumber) {
        errorBox.innerText = "Please enter a tracking number.";
        return;
    }

    try {
        // ---------------------
        // 1. Fetch shipment details
        
        const shipmentRes = await fetch(
            `http://localhost:3000/shipments/track/${trackingNumber}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const shipmentData = await shipmentRes.json();

        if (!shipmentRes.ok) {
            errorBox.innerText = shipmentData.message || "Shipment not found.";
            return;
        }

        const shipment = shipmentData.shipment;

        // Fill shipment details
        document.getElementById("statusText").innerText = shipment.STATUS;
        document.getElementById("originText").innerText = shipment.ORIGINCOUNTRY;
        document.getElementById("destinationText").innerText = shipment.DESTINATIONCOUNTRY;
        document.getElementById("weightText").innerText = shipment.WEIGHT;
        document.getElementById("updatedAtText").innerText = shipment.CREATEDAT;

        resultBox.classList.remove("hidden");

        //--------------------------
        // 2. Fetch status history
        
        const historyRes = await fetch(
            `http://localhost:3000/history/${trackingNumber}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const historyData = await historyRes.json();

        if (historyRes.ok && historyData.history.length > 0) {
            historyData.history.forEach(item => {
                const li = document.createElement("li");
                li.innerText = `${item.TIMESTAMP} — ${item.STATUS}: ${item.MESSAGE}`;
                historyList.appendChild(li);
            });

            historyBox.classList.remove("hidden");
        }

    } catch (err) {
        console.error(err);
        errorBox.innerText = "Error connecting to server.";
    }
}
