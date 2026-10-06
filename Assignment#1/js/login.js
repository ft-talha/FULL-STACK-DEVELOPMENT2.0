// ConnectFriend Login Controller - v1.0

document.addEventListener("DOMContentLoaded", () => {
    renderDemoButtons();
});

function renderDemoButtons() {
    const container = document.getElementById("demo-users-container");
    if (!container) return;

    const demoUsers = getDemoUsers();
    container.innerHTML = demoUsers.map(user => `
        <button type="button" onclick="fillDemoUser('${user.id}')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white border border-teal-200 transition-all flex items-center gap-1.5">
            <span>👤</span><span>Login as ${user.name}</span>
        </button>
    `).join("");
}

function fillDemoUser(userId) {
    const demoUsers = getDemoUsers();
    const u = demoUsers.find(x => x.id === userId);
    if (!u) return;

    document.getElementById("username-input").value = u.email;
    document.getElementById("password-input").value = u.password;
    document.getElementById("error-banner").classList.add("hidden");
    document.getElementById("username-input").focus();
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username-input").value.trim();
    const password = document.getElementById("password-input").value.trim();
    const errorBanner = document.getElementById("error-banner");
    const errorMessage = document.getElementById("error-message");

    if (!username || !password) {
        errorMessage.innerText = "Please fill in both fields.";
        errorBanner.classList.remove("hidden");
        return;
    }

    if (password.length < 4) {
        errorMessage.innerText = "Password must be at least 4 characters.";
        errorBanner.classList.remove("hidden");
        return;
    }

    errorBanner.classList.add("hidden");
    localStorage.setItem("cf_is_logged_in", "true");

    // Build a full user object so nothing shows "undefined"
    const demoUsers = getDemoUsers();
    const matched = demoUsers.find(u => u.email.toLowerCase() === username.toLowerCase());

    let newUser;
    if (matched) {
        newUser = {
            name: matched.name,
            handle: "@" + matched.name.toLowerCase() + "_demo",
            role: "Student Developer",
            bio: `${matched.name} is exploring the ConnectFriend network.`,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            skills: ["JavaScript", "UI/UX", "Tailwind"],
            github: "",
            linkedin: ""
        };
    } else {
        const baseName = username.includes("@") ? username.split("@")[0] : username;
        newUser = {
            name: baseName,
            handle: "@" + baseName.toLowerCase().replace(/\s+/g, ""),
            role: "Student Developer",
            bio: `${baseName} is exploring the ConnectFriend network.`,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            skills: ["JavaScript", "UI/UX", "Tailwind"],
            github: "",
            linkedin: ""
        };
    }

    saveData("cf_user", newUser);
    window.location.href = "home.html";
}