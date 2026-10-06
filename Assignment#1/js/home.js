// ConnectFriend Home Controller - v1.0

document.addEventListener("DOMContentLoaded", () => {
  renderProfileWidget();
  renderInvitesPreview();
  renderFeed();
});

function renderProfileWidget() {
  const user = getData("cf_user") || {};
  document.getElementById("home-user-avatar").src =
    user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
  document.getElementById("home-user-name").innerText = user.name || "Guest User";
  document.getElementById("home-user-role").innerText = user.role || "Student Developer";
  document.getElementById("home-user-bio").innerText = `"${user.bio || "No bio yet."}"`;
}

function renderInvitesPreview() {
  const invites = getData("cf_invitations") || [];
  const container = document.getElementById("home-invites-preview");
  const badge = document.getElementById("nav-invite-badge");

  if (badge) {
    if (invites.length > 0) {
      badge.innerText = invites.length;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  if (!container) return;

  if (invites.length === 0) {
    container.innerHTML = `<p class="text-xs text-gray-400 italic">No pending invitations.</p>`;
    return;
  }

  container.innerHTML = invites.slice(0, 2).map(inv => `
        <div class="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/70 border border-teal-100">
            <img src="${inv.avatar}" class="w-8 h-8 rounded-xl object-cover" alt="">
            <div>
                <h5 class="text-xs font-bold text-gray-900">${inv.name}</h5>
                <span class="text-[10px] text-gray-500">${inv.mutual} mutuals</span>
            </div>
        </div>
    `).join("");
}

function renderFeed() {
  const posts = getData("cf_posts") || [];
  const container = document.getElementById("posts-container");
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `<div class="glass-panel p-8 text-center text-xs text-gray-500 rounded-[28px]">No broadcasts yet.</div>`;
    return;
  }

  container.innerHTML = posts.map(post => `
        <article class="glass-panel rounded-[28px] p-6 space-y-4 interactive-card animate-slide-up">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <img src="${post.avatar}" class="w-10 h-10 rounded-2xl object-cover border border-teal-300" alt="">
                    <div>
                        <h4 class="font-extrabold text-sm text-gray-900">${post.author}</h4>
                        <span class="text-[10px] font-bold text-teal-600">${post.handle} • ${post.timestamp}</span>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    ${post.tag}
                </span>
            </div>
            <p class="text-sm text-gray-800 leading-relaxed">${post.content}</p>
            <div class="flex items-center gap-4 pt-3 border-t border-gray-100 text-xs font-bold text-gray-600">
                <button onclick="likePost(${post.id})" class="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
                    <span>👍</span><span>${post.likes}</span>
                </button>
                <button onclick="dislikePost(${post.id})" class="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                    <span>👎</span><span>${post.dislikes}</span>
                </button>
            </div>
        </article>
    `).join("");
}

function createPost(event) {
  event.preventDefault();
  const contentInput = document.getElementById("post-content");
  const tagInput = document.getElementById("post-tag");
  const user = getData("cf_user") || {};

  const content = contentInput.value.trim();
  if (!content) {
    showToast("Please enter text before publishing.", true);
    return;
  }

  const posts = getData("cf_posts") || [];
  posts.unshift({
    id: Date.now(),
    author: user.name || "Guest User",
    handle: user.handle || "@guest",
    avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    content: content,
    tag: tagInput.value,
    likes: 0,
    dislikes: 0,
    timestamp: "Just now"
  });

  saveData("cf_posts", posts);
  contentInput.value = "";
  renderFeed();
  showToast("Broadcast published!");
}

function likePost(postId) {
  const posts = getData("cf_posts") || [];
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes += 1;
    saveData("cf_posts", posts);
    renderFeed();
  }
}

function dislikePost(postId) {
  const posts = getData("cf_posts") || [];
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.dislikes += 1;
    saveData("cf_posts", posts);
    renderFeed();
  }
}