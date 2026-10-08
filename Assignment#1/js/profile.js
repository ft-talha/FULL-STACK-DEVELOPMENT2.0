// Profile display, bio editing, and user friends list logic[cite: 1]

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = requireAuth();
  document.getElementById("navUserName").textContent = currentUser.name;

  loadProfileInfo();
  loadFriendsList();
  loadMyPosts();
});

// Load Profile Header Details
function loadProfileInfo() {
  document.getElementById("profileName").textContent = currentUser.name;
  document.getElementById("profileUsername").textContent = currentUser.username;
  document.getElementById("profileAvatar").src = currentUser.avatar;
  document.getElementById("profileBioDisplay").textContent = currentUser.bio || "No bio added yet.";
}

// Toggle Bio Edit Form
function toggleBioEdit(show) {
  const display = document.getElementById("profileBioDisplay");
  const editBox = document.getElementById("bioEditBox");
  const btn = document.getElementById("editBioBtn");

  if (show) {
    document.getElementById("bioInput").value = currentUser.bio || "";
    display.classList.add("d-none");
    editBox.classList.remove("d-none");
    btn.classList.add("d-none");
  } else {
    display.classList.remove("d-none");
    editBox.classList.add("d-none");
    btn.classList.remove("d-none");
  }
}

// Save Updated Bio to LocalStorage
function saveBio() {
  const newBio = document.getElementById("bioInput").value.trim();
  currentUser.bio = newBio;

  // Update current session
  localStorage.setItem("cf_current_user", JSON.stringify(currentUser));

  // Update users array
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
  localStorage.setItem("cf_users", JSON.stringify(updatedUsers));

  loadProfileInfo();
  toggleBioEdit(false);
}

// Load List of Friends for current user[cite: 1]
function loadFriendsList() {
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];

  const myFriendIds = friendsRel.filter(f => f.userId === currentUser.id).map(f => f.friendId);
  const myFriends = users.filter(u => myFriendIds.includes(u.id));

  const list = document.getElementById("profileFriendsList");
  list.innerHTML = "";

  if (myFriends.length === 0) {
    list.innerHTML = `<li class="list-group-item text-muted">You have no friends in your network yet.</li>`;
    return;
  }

  myFriends.forEach(f => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center justify-content-between px-0";
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${f.avatar}" class="avatar-img me-2" alt="${f.name}">
        <div>
          <div class="fw-bold">${f.name}</div>
          <span class="text-muted small">@${f.username}</span>
        </div>
      </div>
      <a href="messages.html" class="btn btn-outline-olive btn-sm"><i class="bi bi-chat-dots me-1"></i>Message</a>
    `;
    list.appendChild(li);
  });
}

// Load current user's personal posts[cite: 1]
function loadMyPosts() {
  const posts = JSON.parse(localStorage.getItem("cf_posts")) || [];
  const myPosts = posts.filter(p => p.authorId === currentUser.id);

  const container = document.getElementById("myPostsContainer");
  container.innerHTML = "";

  if (myPosts.length === 0) {
    container.innerHTML = `<p class="text-muted mb-0">You haven't posted any news updates yet.</p>`;
    return;
  }

  myPosts.forEach(p => {
    const div = document.createElement("div");
    div.className = "p-3 mb-2 bg-light rounded border";
    div.innerHTML = `
      <p class="mb-2 fw-semibold">${p.content}</p>
      <div class="small text-muted d-flex justify-content-between">
        <span>${formatTimeAgo(p.timestamp)}</span>
        <span>Likes: ${p.likes ? p.likes.length : 0} | Dislikes: ${p.dislikes ? p.dislikes.length : 0}[cite: 1, 2]</span>
      </div>
    `;
    container.appendChild(div);
  });
}