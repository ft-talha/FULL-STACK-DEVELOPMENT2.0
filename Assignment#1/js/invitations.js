// Friend invitation handling, ignore list enforcement, and friend ratings logic[cite: 1]

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = requireAuth();
  document.getElementById("navUserName").textContent = currentUser.name;

  populateInviteUserDropdown();
  renderPendingInvitations();
  renderFriendRatings();
});

// Populate dropdown for sending invites (excluding existing friends)
function populateInviteUserDropdown() {
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];

  const myFriendIds = friendsRel.filter(f => f.userId === currentUser.id).map(f => f.friendId);
  const availableUsers = users.filter(u => u.id !== currentUser.id && !myFriendIds.includes(u.id));

  const select = document.getElementById("userToInviteSelect");
  select.innerHTML = `<option value="">-- Select a user to invite --</option>`;

  availableUsers.forEach(u => {
    select.innerHTML += `<option value="${u.id}">${u.name} (@${u.username})</option>`;
  });
}

// Send Friend Invitation with IGNORE LIST check[cite: 1]
function sendFriendInvitation() {
  const targetId = document.getElementById("userToInviteSelect").value;
  const alertBox = document.getElementById("inviteAlert");

  if (!targetId) {
    showAlert("Please select a user to invite.", "danger");
    return;
  }

  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const targetUser = users.find(u => u.id === targetId);

  // CRITICAL REQUIREMENT CHECK: If target has sender in ignore list, request CANNOT be sent[cite: 1]
  if (targetUser && targetUser.ignoreList && targetUser.ignoreList.includes(currentUser.id)) {
    showAlert(`<strong>Request Blocked!</strong> ${targetUser.name} has placed you on their ignore list. Friend request cannot be sent.[cite: 1]`, "danger");
    return;
  }

  const invitations = JSON.parse(localStorage.getItem("cf_invitations")) || [];

  // Check if invitation already exists
  const existing = invitations.find(i => i.senderId === currentUser.id && i.receiverId === targetId && i.status === "pending");
  if (existing) {
    showAlert("Invitation is already pending for this user.", "warning");
    return;
  }

  invitations.push({
    id: "inv_" + Date.now(),
    senderId: currentUser.id,
    receiverId: targetId,
    status: "pending"
  });

  localStorage.setItem("cf_invitations", JSON.stringify(invitations));
  showAlert(`Friend request successfully sent to ${targetUser.name}!`, "success");
  document.getElementById("userToInviteSelect").value = "";
}

function showAlert(msg, type) {
  const alertBox = document.getElementById("inviteAlert");
  alertBox.className = `alert alert-${type} py-2 mb-3`;
  alertBox.innerHTML = msg;
  alertBox.classList.remove("d-none");
}

// Render Received Pending Invitations[cite: 1]
function renderPendingInvitations() {
  const invitations = JSON.parse(localStorage.getItem("cf_invitations")) || [];
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];

  const myPending = invitations.filter(i => i.receiverId === currentUser.id && i.status === "pending");
  const list = document.getElementById("pendingInvitesList");
  list.innerHTML = "";

  if (myPending.length === 0) {
    list.innerHTML = `<li class="list-group-item text-muted small">No pending friend requests.</li>`;
    return;
  }

  myPending.forEach(inv => {
    const sender = users.find(u => u.id === inv.senderId);
    if (!sender) return;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center justify-content-between px-0";
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${sender.avatar}" class="avatar-img me-2" alt="${sender.name}">
        <div>
          <div class="fw-bold small">${sender.name}</div>
          <span class="text-muted style="font-size:11px;">@${sender.username}</span>
        </div>
      </div>
      <div>
        <button onclick="respondInvitation('${inv.id}', 'accept')" class="btn btn-olive btn-sm me-1">Accept</button>
        <button onclick="respondInvitation('${inv.id}', 'reject')" class="btn btn-outline-danger btn-sm">Reject</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Respond to Friend Request (Accept / Reject)[cite: 1]
function respondInvitation(invId, action) {
  let invitations = JSON.parse(localStorage.getItem("cf_invitations")) || [];
  const inv = invitations.find(i => i.id === invId);

  if (!inv) return;

  if (action === "accept") {
    inv.status = "accepted";
    // Add friend relationships in both directions[cite: 1]
    const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];
    friendsRel.push({ userId: inv.senderId, friendId: inv.receiverId });
    friendsRel.push({ userId: inv.receiverId, friendId: inv.senderId });
    localStorage.setItem("cf_friends", JSON.stringify(friendsRel));
  } else {
    inv.status = "rejected";
  }

  localStorage.setItem("cf_invitations", JSON.stringify(invitations));
  renderPendingInvitations();
  populateInviteUserDropdown();
  renderFriendRatings();
}

// Render Friend Rating Scale 1-3 (1=Stupid 💩, 2=Cool 😎, 3=Trustworthy 🛡️)[cite: 1]
function renderFriendRatings() {
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];
  const ratings = JSON.parse(localStorage.getItem("cf_ratings")) || [];

  const myFriendIds = friendsRel.filter(f => f.userId === currentUser.id).map(f => f.friendId);
  const myFriends = users.filter(u => myFriendIds.includes(u.id));

  const container = document.getElementById("friendRatingList");
  container.innerHTML = "";

  if (myFriends.length === 0) {
    container.innerHTML = `<p class="text-muted small">You have no friends to rate yet.</p>`;
    return;
  }

  myFriends.forEach(friend => {
    // Find current user's rating for this friend[cite: 1]
    const ratingObj = ratings.find(r => r.raterId === currentUser.id && r.targetId === friend.id);
    const currentRating = ratingObj ? ratingObj.rating : 0;

    const div = document.createElement("div");
    div.className = "d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded border";
    div.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${friend.avatar}" class="avatar-img me-2" style="width:36px;height:36px;" alt="${friend.name}">
        <span class="fw-bold small">${friend.name}</span>
      </div>
      <div class="btn-group btn-group-sm" role="group">
        <button onclick="rateFriend('${friend.id}', 1)" class="btn ${currentRating === 1 ? 'btn-danger' : 'btn-outline-danger'}" title="1: Stupid">
          💩 Stupid[cite: 1]
        </button>
        <button onclick="rateFriend('${friend.id}', 2)" class="btn ${currentRating === 2 ? 'btn-warning' : 'btn-outline-warning'}" title="2: Cool">
          😎 Cool[cite: 1]
        </button>
        <button onclick="rateFriend('${friend.id}', 3)" class="btn ${currentRating === 3 ? 'btn-success' : 'btn-outline-success'}" title="3: Trustworthy">
          🛡️ Trustworthy[cite: 1]
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Rate Friend function[cite: 1]
function rateFriend(targetId, ratingValue) {
  let ratings = JSON.parse(localStorage.getItem("cf_ratings")) || [];
  const index = ratings.findIndex(r => r.raterId === currentUser.id && r.targetId === targetId);

  if (index >= 0) {
    ratings[index].rating = ratingValue;
  } else {
    ratings.push({ raterId: currentUser.id, targetId: targetId, rating: ratingValue });
  }

  localStorage.setItem("cf_ratings", JSON.stringify(ratings));
  renderFriendRatings();
}