// Home page feed, login order sidebar, post publishing, and likes/dislikes logic

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = requireAuth();
  document.getElementById("navUserName").textContent = currentUser.name;

  renderFriendsByLogin();
  renderSelectiveFriendsCheckboxes();
  renderNewsFeed();
});

// Render sidebar: Friends sorted by login time (latest first)
function renderFriendsByLogin() {
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];

  // Get current user's friend IDs
  const myFriendIds = friendsRel
    .filter(f => f.userId === currentUser.id)
    .map(f => f.friendId);

  // Filter user objects for friends
  const friendUsers = users.filter(u => myFriendIds.includes(u.id));

  // Sort friends by lastLogin descending (latest first)
  friendUsers.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));

  const listContainer = document.getElementById("friendsLoginList");
  listContainer.innerHTML = "";

  if (friendUsers.length === 0) {
    listContainer.innerHTML = `<li class="list-group-item text-muted small">No friends added yet.</li>`;
    return;
  }

  friendUsers.forEach(friend => {
    const timeAgo = formatTimeAgo(friend.lastLogin);
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center justify-content-between px-0";
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${friend.avatar}" class="avatar-img me-2" alt="${friend.name}">
        <div>
          <div class="fw-bold small">${friend.name}</div>
          <span class="badge badge-yellow" style="font-size:10px;">Logged in ${timeAgo}</span>
        </div>
      </div>
    `;
    listContainer.appendChild(li);
  });
}

// Render checkboxes for selecting specific friends when sharing news
function renderSelectiveFriendsCheckboxes() {
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];
  const myFriendIds = friendsRel.filter(f => f.userId === currentUser.id).map(f => f.friendId);
  const friendUsers = users.filter(u => myFriendIds.includes(u.id));

  const box = document.getElementById("friendsCheckboxes");
  box.innerHTML = "";

  if (friendUsers.length === 0) {
    box.innerHTML = `<span class="text-muted">You have no friends to select.</span>`;
    return;
  }

  friendUsers.forEach(f => {
    box.innerHTML += `
      <div class="form-check">
        <input class="form-check-input friend-select-cb" type="checkbox" value="${f.id}" id="cb_${f.id}">
        <label class="form-check-label" for="cb_${f.id}">${f.name}</label>
      </div>
    `;
  });
}

// Toggle specific friends checklist UI
function toggleSpecificFriendsSelector() {
  const selectVal = document.getElementById("shareAudienceSelect").value;
  const box = document.getElementById("specificFriendsBox");
  if (selectVal === "some") {
    box.classList.remove("d-none");
  } else {
    box.classList.add("d-none");
  }
}

// Publish a new post/news item[cite: 1]
function publishPost() {
  const text = document.getElementById("postContent").value.trim();
  if (!text) {
    alert("Please write some content before publishing!");
    return;
  }

  const audienceType = document.getElementById("shareAudienceSelect").value;
  let targetAudience = "all";

  if (audienceType === "some") {
    const selectedBoxes = document.querySelectorAll(".friend-select-cb:checked");
    const selectedIds = Array.from(selectedBoxes).map(cb => cb.value);

    if (selectedIds.length === 0) {
      alert("Please select at least one friend to share with, or choose 'All Friends'.");
      return;
    }
    // Target audience includes selected friends plus author
    targetAudience = [...selectedIds, currentUser.id];
  }

  const posts = JSON.parse(localStorage.getItem("cf_posts")) || [];
  const newPost = {
    id: "p_" + Date.now(),
    authorId: currentUser.id,
    content: text,
    timestamp: new Date().toISOString(),
    audience: targetAudience,
    likes: [],
    dislikes: []
  };

  posts.unshift(newPost);
  localStorage.setItem("cf_posts", JSON.stringify(posts));

  // Reset form
  document.getElementById("postContent").value = "";
  document.getElementById("shareAudienceSelect").value = "all";
  toggleSpecificFriendsSelector();

  renderNewsFeed();
}

// Render News Feed including author info, time since last login, news text, likes & dislikes[cite: 1, 2]
function renderNewsFeed() {
  const posts = JSON.parse(localStorage.getItem("cf_posts")) || [];
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];

  const myFriendIds = friendsRel.filter(f => f.userId === currentUser.id).map(f => f.friendId);
  const container = document.getElementById("newsFeedContainer");
  container.innerHTML = "";

  // Filter posts visible to current user[cite: 1]
  const visiblePosts = posts.filter(post => {
    // Show if author is current user
    if (post.authorId === currentUser.id) return true;
    // Show if author is a friend AND audience is 'all' or contains currentUser
    if (myFriendIds.includes(post.authorId)) {
      if (post.audience === "all") return true;
      if (Array.isArray(post.audience) && post.audience.includes(currentUser.id)) return true;
    }
    return false;
  });

  if (visiblePosts.length === 0) {
    container.innerHTML = `
      <div class="cf-card p-4 text-center text-muted">
        <i class="bi bi-card-heading fs-2 d-block mb-2 text-warning"></i>
        No news posts to show right now. Create a post or invite more friends!
      </div>`;
    return;
  }

  visiblePosts.forEach(post => {
    const author = users.find(u => u.id === post.authorId) || { name: "Unknown", avatar: "", lastLogin: new Date().toISOString() };
    const timeAgo = formatTimeAgo(post.timestamp);
    const authorLastLoginAgo = formatTimeAgo(author.lastLogin);

    const hasLiked = post.likes && post.likes.includes(currentUser.id);
    const hasDisliked = post.dislikes && post.dislikes.includes(currentUser.id);

    const card = document.createElement("div");
    card.className = "cf-card p-3";
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center">
          <img src="${author.avatar}" class="avatar-img me-3" alt="${author.name}">
          <div>
            <h6 class="mb-0 fw-bold">${author.name}</h6>
            <span class="small text-muted" style="font-size: 11px;">
              <i class="bi bi-clock me-1"></i>Post: ${timeAgo} | 
              <i class="bi bi-person-check me-1"></i>Author last logged in: <strong>${authorLastLoginAgo}</strong>[cite: 1]
            </span>
          </div>
        </div>
        ${post.audience !== 'all' ? '<span class="badge badge-yellow"><i class="bi bi-lock me-1"></i>Selective</span>' : ''}
      </div>

      <p class="mb-3 fs-6">${post.content}</p>

      <div class="d-flex align-items-center gap-3 pt-2 border-top">
        <button onclick="handleLikeDislike('${post.id}', 'like')" class="btn btn-sm ${hasLiked ? 'btn-olive' : 'btn-outline-olive'}">
          <i class="bi bi-hand-thumbs-up-fill me-1"></i> Like (${post.likes ? post.likes.length : 0})[cite: 1, 2]
        </button>
        <button onclick="handleLikeDislike('${post.id}', 'dislike')" class="btn btn-sm ${hasDisliked ? 'btn-dark' : 'btn-outline-dark'}">
          <i class="bi bi-hand-thumbs-down-fill me-1"></i> Dislike (${post.dislikes ? post.dislikes.length : 0})[cite: 1, 2]
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Like or Dislike Post toggle logic[cite: 1, 2]
function handleLikeDislike(postId, action) {
  const posts = JSON.parse(localStorage.getItem("cf_posts")) || [];
  const post = posts.find(p => p.id === postId);

  if (!post) return;

  if (!post.likes) post.likes = [];
  if (!post.dislikes) post.dislikes = [];

  if (action === 'like') {
    if (post.likes.includes(currentUser.id)) {
      post.likes = post.likes.filter(id => id !== currentUser.id); // Toggle off
    } else {
      post.likes.push(currentUser.id);
      post.dislikes = post.dislikes.filter(id => id !== currentUser.id); // Remove dislike if liked
    }
  } else if (action === 'dislike') {
    if (post.dislikes.includes(currentUser.id)) {
      post.dislikes = post.dislikes.filter(id => id !== currentUser.id); // Toggle off
    } else {
      post.dislikes.push(currentUser.id);
      post.likes = post.likes.filter(id => id !== currentUser.id); // Remove like if disliked
    }
  }

  localStorage.setItem("cf_posts", JSON.stringify(posts));
  renderNewsFeed();
}