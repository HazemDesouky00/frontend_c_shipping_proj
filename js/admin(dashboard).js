// admin.js

// 1. Read token
const token = localStorage.getItem("token");

// If not logged in, redirects user 
if (!token) {
    window.location.href = "login.html";
}

// 2. Load admin profile
async function loadAdmin() {
    try {
        const res = await fetch("http://localhost:3000/users/me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();

        if (!res.ok) {
            window.location.href = "login.html";
            return;
        }

        // Check role
        if (data.user.ROLE !== "ADMIN") {
            window.location.href = "home.html";
            return;
        }

        //  showing admin name upon entry
        document.getElementById("adminWelcome").innerText =
            `Admin Dashboard - ${data.user.NAME}`;

    } catch (err) {
        console.error(err);
        window.location.href = "login.html";
    }
}

// 3. Logout
function logoutAdmin() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

window.logoutAdmin = logoutAdmin;

// Init
loadAdmin();
