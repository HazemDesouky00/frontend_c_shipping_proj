// profile.js

// 1 read tokento check if there is one 
const token = localStorage.getItem("token");

// If not logged in,redirect
if (!token) {
    window.location.href = "login.html";
}

// get element id's that are in the profile html page that i declared
const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const passwordInput = document.getElementById("profilePassword");
const errorBox = document.getElementById("profileError");
const successBox = document.getElementById("profileSuccess");
const saveBtn = document.getElementById("updateProfileBtn");

// 2. load user profile
async function loadProfile() {
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

        // Fill inputs
        nameInput.value = data.user.NAME;
        emailInput.value = data.user.EMAIL;

    } catch (err) {
        console.error(err);
        errorBox.innerText = "Error loading profile.";
    }
}

// 3. save profile updates
saveBtn.addEventListener("click", async () => {
    errorBox.innerText = "";
    successBox.innerText = "";

    const updatedData = {};
    let hasChanges = false; //checking the fields that are chaning 

    if (nameInput.value.trim() !== "") {
        updatedData.name = nameInput.value.trim();
        hasChanges = true;
    }

    if (emailInput.value.trim() !== "") {
        updatedData.email = emailInput.value.trim();
        hasChanges = true;
    }

    if (passwordInput.value.trim() !== "") {
        updatedData.password = passwordInput.value.trim();
        hasChanges = true;
    }

    // if no change has happened 
    if (!hasChanges) {
        errorBox.innerText = "Nothing to update.";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(updatedData)
        });

        const data = await res.json();

        if (!res.ok) {
            errorBox.innerText = data.message || "Update failed.";
            return;
        }

        successBox.innerText = "Profile updated successfully.";
        passwordInput.value = ""; // clearing password field

    } catch (err) {
        console.error(err);
        errorBox.innerText = "Server error.";
    }
});

// Init
loadProfile();
