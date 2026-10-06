// ConnectFriend Invitations Controller - v1.0

document.addEventListener("DOMContentLoaded", () => {
  renderInvitations();
  renderSuggested();
  renderFriendMatrix();
});

function renderInvitations() {
  const invites = getData("cf_invitations") || [];
  const container = document.getElementById("invitations-grid");
  const badge = document.getElementById("invitation-count-badge");

  if (badge) badge.innerText = `${invites.length} Invites`;
  if (!container) return;

  if (invites.length === 0) {
    container.innerHTML = `<div class="col-span-full p-6 text-center text-xs text-gray-500">No pending invitations.</div>`;
    return;
  }

  container.innerHTML = invites.map(inv => `
        <div class="glass-panel p-5 rounded-2xl flex items-center justify-between interactive-card">
            <div class="flex items-center gap-3">
                <img src="${inv.avatar}" class="w-12 h-12 rounded-2xl object-cover border border-teal-300" alt="">
                <div>
                    <h4 class="font-extrabold text-sm text-gray-900">${inv.name}</h4>
                    <p class="text-[11px] text-teal-600 font-semibold">${inv.handle} • ${inv.mutual} mutuals</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="acceptInvitation(${inv.id})"
                    class="px-3.5 py-2 rounded-xl btn-primary-gradient text-white text-xs font-bold">Accept</button>
                <button onclick="rejectInvitation(${inv.id})"
                    class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold border border-gray-200">Decline</button>
            </div>
        </div>
    `).join("");
}

// NEW: suggested users section
function renderSuggested() {
  const suggested = getData("cf_suggested") || [];
  const container = document.getElementById("suggested-grid");
  if (!container) return;

  if (suggested.length === 0) {
    container.innerHTML = `<div class="col-span-full p-6 text-center text-xs text-gray-500">No suggestions available.</div>`;
    return;
  }

  container.innerHTML = suggested.map(user => `
        <div class="glass-panel p-5 rounded-2xl flex items-center justify-between interactive-card">
            <div class="flex items-center gap-3">
                <img src="${user.avatar}" class="w-12 h-12 rounded-2xl object-cover border border-amber-300" alt="">
                <div>
                    <h4 class="font-extrabold text-sm text-gray-900">${user.name}</h4>
                    <p class="text-[11px] text-amber-600 font-semibold">${user.handle} • ${user.mutual} mutuals</p>
                </div>
            </div>
            <button onclick="sendInvitation(${user.id})"
                class="px-3.5 py-2 rounded-xl btn-amber text-white text-xs font-bold">+ Send</button>
        </div>
    `).join("");
}

function sendInvitation(userId) {
  let suggested = getData("cf_suggested") || [];
  let invites = getData("cf_invitations") || [];

  const user = suggested.find(u => u.id === userId);
  if (!user) return;

  // move to invitations
  invites.push(user);
  suggested = suggested.filter(u => u.id !== userId);

  saveData("cf_invitations", invites);
  saveData("cf_suggested", suggested);

  renderInvitations();
  renderSuggested();
  showToast(`Invitation sent to ${user.name}!`);
}

function acceptInvitation(id) {
  let invites = getData("cf_invitations") || [];
  let friends = getData("cf_friends") || [];

  const accepted = invites.find(i => i.id === id);
  if (!accepted) return;

  invites = invites.filter(i => i.id !== id);
  friends.push({
    id: accepted.id,
    name: accepted.name,
    handle: accepted.handle,
    rating: 5,
    status: "Active",
    avatar: accepted.avatar
  });

  saveData("cf_invitations", invites);
  saveData("cf_friends", friends);
  renderInvitations();
  renderFriendMatrix();
  showToast(`Connected with ${accepted.name}!`);
}

function rejectInvitation(id) {
  let invites = getData("cf_invitations") || [];
  invites = invites.filter(i => i.id !== id);
  saveData("cf_invitations", invites);
  renderInvitations();
  showToast("Invitation declined.", true);
}

function renderFriendMatrix() {
  const friends = getData("cf_friends") || [];
  const container = document.getElementById("friends-matrix-grid");
  if (!container) return;

  if (friends.length === 0) {
    container.innerHTML = `<div class="col-span-full p-6 text-center text-xs text-gray-500">No connections yet.</div>`;
    return;
  }

  container.innerHTML = friends.map(friend => `
        <div class="glass-panel p-5 rounded-2xl text-center space-y-3 interactive-card">
            <img src="${friend.avatar}" class="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-teal-400" alt="">
            <div>
                <h4 class="font-extrabold text-sm text-gray-900">${friend.name}</h4>
                <span class="text-xs font-semibold text-teal-600">${friend.handle}</span>
            </div>
            <div class="pt-2 border-t border-gray-100">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Authenticity</label>
                <div class="flex items-center justify-center gap-1">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <button onclick="rateFriend(${friend.id},${star})"
                            class="star-btn text-lg ${star <= friend.rating ? 'text-amber-400' : 'text-gray-300'}">★</button>
                    `).join("")}
                </div>
            </div>
        </div>
    `).join("");
}

function rateFriend(friendId, rating) {
  const friends = getData("cf_friends") || [];
  const friend = friends.find(f => f.id === friendId);
  if (friend) {
    friend.rating = rating;
    saveData("cf_friends", friends);
    renderFriendMatrix();
    showToast(`Updated ${friend.name}'s rating to ${rating} stars!`);
  }
}