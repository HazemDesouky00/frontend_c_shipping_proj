document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // getting the values from the field box 
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // clearing the old error messages that were there from the previous attempt
    document.getElementById("nameErr").innerText = "";
    document.getElementById("emailErr").innerText = "";
    document.getElementById("passwordErr").innerText = "";
    document.getElementById("confirmPassErr").innerText = "";
    document.getElementById("signupMessage").innerText = "";

    let valid = true;

    // name validation
    if (name.length < 2) {
        document.getElementById("nameErr").innerText = "Name must be at least 2 characters";
        valid = false;
    }

    // email validation
    if (!email.includes("@")) {
        document.getElementById("emailErr").innerText = "Invalid email format";
        valid = false;
    }

    // password validation
    if (password.length < 6) {
        document.getElementById("passwordErr").innerText = "Password must be at least 6 characters";
        valid = false;
    }

    // confirm password
    if (password !== confirmPassword) {
        document.getElementById("confirmPassErr").innerText = "Passwords do not match";
        valid = false;
    }

    if (!valid) return;

    try {
        const res = await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful!");
            window.location.href = "login.html";
        } else {
            document.getElementById("signupMessage").innerText = data.message || "Signup failed";
        }

    } catch (err) {
        console.error(err);
        document.getElementById("signupMessage").innerText =
            "Could not connect to server. Try again.";
    }
});
