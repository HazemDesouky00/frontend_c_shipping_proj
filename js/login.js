document.getElementById("loginBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    let valid = true;

    // ---- Validation from frontend side  ----
    if (!email.includes("@")) {
        document.getElementById("loginEmailErr").innerText = "Invalid email format";
        valid = false;
    } else {
        document.getElementById("loginEmailErr").innerText = "";
    }

    if (password.length < 3) {
        document.getElementById("loginPassErr").innerText = "Password too short";
        valid = false;
    } else {
        document.getElementById("loginPassErr").innerText = "";
    }

    if (!valid) return;

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Login failed");
            return;
        }

        // ------------------------
        // Save token to localStorage
        
        localStorage.setItem("token", data.token);

        alert("Login successful!");

        // ------------------------
        // Redirect based on role
        
        if (data.user.role === "ADMIN") {
            window.location.href = "admin(dashboard).html";
        } else {
            window.location.href = "home.html";
        }

    } catch (err) {
        console.error(err);
        alert("Could not connect to server.");
    }
});
