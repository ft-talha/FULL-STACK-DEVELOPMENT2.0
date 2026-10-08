// Login verification and session handler

document.addEventListener("DOMContentLoaded", () => {
    // If user is already logged in, redirect to home
    if (getCurrentUser()) {
        window.location.href = "home.html";
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const errorAlert = document.getElementById("errorAlert");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById("username").value.trim().toLowerCase();
        const passwordInput = document.getElementById("password").value.trim();

        const users = JSON.parse(localStorage.getItem("cf_users")) || [];

        // Find matching user
        const foundUser = users.find(u => u.username.toLowerCase() === usernameInput && u.password === passwordInput);

        if (foundUser) {
            // Update last login timestamp
            foundUser.lastLogin = new Date().toISOString();

            // Save back to users array in storage
            const updatedUsers = users.map(u => u.id === foundUser.id ? foundUser : u);
            localStorage.setItem("cf_users", JSON.stringify(updatedUsers));

            // Save current active session
            localStorage.setItem("cf_current_user", JSON.stringify(foundUser));

            // Redirect to home dashboard
            window.location.href = "home.html";
        } else {
            errorAlert.textContent = "Invalid username or password! (Try 'alex' and '123')";
            errorAlert.classList.remove("d-none");
        }
    });
});