// ConnectFriend Profile Controller - v1.0

document.addEventListener("DOMContentLoaded", () => {
    renderProfile();
    renderStats();
    renderUserPosts();
    renderSkillsAndLinks();
});

function renderProfile() {
    const user = getData("cf_user") || {};
    document.getElementById("profile-avatar").src =
        user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
    document.getElementById("profile-name").innerText = user.name || "Guest User";
    document.getElementById("profile-handle").innerText = user.handle || "@guest";
    document.getElementById("profile-role").innerText = user.role || "Student Developer";
    document.getElementById("profile-bio").innerText = `"${user.bio || "No bio yet."}"`;

    const aboutBio = document.getElementById("about-tab-bio");
    if (aboutBio) aboutBio.innerText = user.bio || "No bio yet.";
}

function renderStats() {
    const posts = getData("cf_posts") || [];
    const friends = getData("cf_friends") || [];
    const user = getData("cf_user") || {};

    const myPosts = posts.filter(p => p.author === user.name || p.handle === user.handle).length;

    let total = 0;
    friends.forEach(f => total += (f.rating || 5));
    const avg = friends.length > 0 ? (total / friends.length).toFixed(1) : "5.0";

    document.getElementById("stat-posts").innerText = myPosts;
    document.getElementById("stat-friends").innerText = friends.length;
    document.getElementById("stat-avg-rating").innerText = `${avg} ★`;
}

function renderSkillsAndLinks() {
    const user = getData("cf_user") || {};
    const skillsContainer = document.getElementById("skills-container");
    const githubLink = document.getElementById("link-github");
    const linkedinLink = document.getElementById("link-linkedin");

    const skills = user.skills || ["JavaScript", "UI/UX", "Tailwind"];

    if (skillsContainer) {
        skillsContainer.innerHTML = skills.map(s => `
            <span class="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                ${s.trim()}
            </span>
        `).join("");
    }

    if (githubLink) githubLink.href = user.github ? `https://github.com/${user.github}` : "https://github.com";
    if (linkedinLink) linkedinLink.href = user.linkedin ? `https://linkedin.com/in/${user.linkedin}` : "https://linkedin.com";
}

function renderUserPosts() {
    const posts = getData("cf_posts") || [];
    const user = getData("cf_user") || {};
    const container = document.getElementById("user-posts-container");
    if (!container) return;

    const myPosts = posts.filter(p => p.author === user.name || p.handle === user.handle);

    if (myPosts.length === 0) {
        container.innerHTML = `<div class="glass-panel p-8 text-center text-xs text-gray-500 rounded-[28px]">You haven't published any broadcasts yet.</div>`;
        return;
    }

    container.innerHTML = myPosts.map(post => `
        <article class="glass-panel rounded-[28px] p-5 space-y-3">
            <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    ${post.tag}
                </span>
                <span class="text-[10px] text-gray-400 font-semibold">${post.timestamp}</span>
            </div>
            <p class="text-sm text-gray-800 leading-relaxed">${post.content}</p>
            <div class="flex items-center gap-4 pt-2 border-t border-gray-100 text-xs font-bold text-gray-500">
                <span>👍 ${post.likes}</span><span>👎 ${post.dislikes}</span>
            </div>
        </article>
    `).join("");
}

function switchTab(tabName) {
    const feed = document.getElementById("tab-content-feed");
    const about = document.getElementById("tab-content-about");
    const feedBtn = document.getElementById("tab-btn-feed");
    const aboutBtn = document.getElementById("tab-btn-about");

    if (tabName === "feed") {
        feed.classList.remove("hidden");
        about.classList.add("hidden");
        feedBtn.className = "py-3.5 tab-active transition-all";
        aboutBtn.className = "py-3.5 hover:text-gray-900 transition-all";
    } else {
        feed.classList.add("hidden");
        about.classList.remove("hidden");
        feedBtn.className = "py-3.5 hover:text-gray-900 transition-all";
        aboutBtn.className = "py-3.5 tab-active transition-all";
    }
}

function toggleEditModal() {
    const modal = document.getElementById("edit-modal");
    const user = getData("cf_user") || {};

    if (modal.classList.contains("hidden")) {
        document.getElementById("edit-name").value = user.name || "";
        document.getElementById("edit-role").value = user.role || "";
        document.getElementById("edit-bio").value = user.bio || "";
        document.getElementById("edit-skills").value = (user.skills || []).join(", ");
        document.getElementById("edit-github").value = user.github || "";
        document.getElementById("edit-linkedin").value = user.linkedin || "";
        modal.classList.remove("hidden");
    } else {
        modal.classList.add("hidden");
    }
}

function saveProfileChanges(event) {
    event.preventDefault();
    const user = getData("cf_user") || {};

    user.name = document.getElementById("edit-name").value.trim() || user.name;
    user.role = document.getElementById("edit-role").value.trim() || user.role;
    user.bio = document.getElementById("edit-bio").value.trim() || user.bio;

    const rawSkills = document.getElementById("edit-skills").value.trim();
    if (rawSkills) user.skills = rawSkills.split(",").map(s => s.trim());

    user.github = document.getElementById("edit-github").value.trim();
    user.linkedin = document.getElementById("edit-linkedin").value.trim();

    saveData("cf_user", user);
    toggleEditModal();
    renderProfile();
    renderSkillsAndLinks();
    showToast("Profile updated!");
}