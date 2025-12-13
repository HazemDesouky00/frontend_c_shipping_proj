
//  home.js for User Dashboard

// 1. reading token 
const token = localStorage.getItem("token");

// if no token kick back and redirect to login
if (!token) {
    window.location.href = "login.html";
}

// 2) fetching user profile
async function loadUser() {
    try {
        const res = await fetch("http://localhost:3000/users/me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();

        if (!res.ok) {
            console.log(data.message);
            window.location.href = "login.html";
            return;
        }

        // User data
        const user = data.user;

        // If admin → redirect to ADMIN DASHBOARD
        if (user.ROLE === "ADMIN") {
            window.location.href = "admin.html";
            return;
        }

        // Set welcome name
        document.getElementById("welcomeUser").innerText =
            `Welcome, ${data.user.NAME}`;

    } catch (err) {
        console.error("Error loading user:", err);
        window.location.href = "login.html";
    }
}

loadUser();


// 3) LOGOUT FUNCTION
function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

window.logoutUser = logoutUser; // make it callable from home.html
