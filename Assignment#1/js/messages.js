// Private Messaging with both Friends and Non-Friends & simulated automated responses[cite: 2]

let currentUser = null;
let activePartnerId = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = requireAuth();
  document.getElementById("navUserName").textContent = currentUser.name;

  renderMembersList();

  // Handle Enter key in message input
  document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

// Render all platform members (Friends + Non-Friends)[cite: 2]
function renderMembersList() {
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const friendsRel = JSON.parse(localStorage.getItem("cf_friends")) || [];

  const myFriendIds = friendsRel.filter(f => f.userId === currentUser.id).map(f => f.friendId);
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const list = document.getElementById("membersChatList");
  list.innerHTML = "";

  otherUsers.forEach(u => {
    const isFriend = myFriendIds.includes(u.id);
    const li = document.createElement("li");
    li.className = `list-group-item list-group-item-action d-flex align-items-center justify-content-between cursor-pointer ${activePartnerId === u.id ? 'active' : ''}`;
    li.onclick = () => selectChatPartner(u.id);
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${u.avatar}" class="avatar-img me-2" style="width:38px;height:38px;" alt="${u.name}">
        <div>
          <div class="fw-bold small ${activePartnerId === u.id ? 'text-white' : ''}">${u.name}</div>
          <span class="small ${activePartnerId === u.id ? 'text-white-50' : 'text-muted'}" style="font-size:11px;">
            ${isFriend ? '<span class="badge badge-olive">Friend</span>' : '<span class="badge badge-yellow">Non-Friend</span>'}[cite: 2]
          </span>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

// Select chat partner
function selectChatPartner(partnerId) {
  activePartnerId = partnerId;
  const users = JSON.parse(localStorage.getItem("cf_users")) || [];
  const partner = users.find(u => u.id === partnerId);

  document.getElementById("activeChatPartnerName").textContent = partner ? partner.name : "Chat";
  document.getElementById("messageInput").disabled = false;
  document.getElementById("sendMsgBtn").disabled = false;

  renderMembersList();
  renderChatMessages();
}

// Render conversation thread
function renderChatMessages() {
  if (!activePartnerId) return;

  const messages = JSON.parse(localStorage.getItem("cf_messages")) || [];
  const box = document.getElementById("chatBox");
  box.innerHTML = "";

  // Filter messages exchanged between currentUser and activePartnerId[cite: 2]
  const thread = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === activePartnerId) ||
    (m.senderId === activePartnerId && m.receiverId === currentUser.id)
  );

  if (thread.length === 0) {
    box.innerHTML = `<div class="text-center text-muted my-auto small">No messages exchanged yet. Say hi!</div>`;
    return;
  }

  thread.forEach(msg => {
    const isSentByMe = msg.senderId === currentUser.id;
    const bubble = document.createElement("div");
    bubble.className = isSentByMe ? "chat-bubble-sent" : "chat-bubble-received";
    bubble.innerHTML = `
      <div>${msg.text}</div>
      <div class="text-end opacity-75 mt-1" style="font-size: 9px;">${formatTimeAgo(msg.timestamp)}</div>
    `;
    box.appendChild(bubble);
  });

  // Auto-scroll to bottom of conversation
  box.scrollTop = box.scrollHeight;
}

// Send private message & simulate quick response[cite: 2]
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (!text || !activePartnerId) return;

  const messages = JSON.parse(localStorage.getItem("cf_messages")) || [];
  const newMsg = {
    id: "m_" + Date.now(),
    senderId: currentUser.id,
    receiverId: activePartnerId,
    text: text,
    timestamp: new Date().toISOString()
  };

  messages.push(newMsg);
  localStorage.setItem("cf_messages", JSON.stringify(messages));
  input.value = "";

  renderChatMessages();

  // Simulated quick auto-response[cite: 2]
  setTimeout(() => {
    const responses = [
      "Hey! Got your message on ConnecFriend![cite: 2]",
      "Thanks for reaching out! Everything is looking good here.",
      "Awesome! Talk to you soon!"
    ];
    const randomReply = responses[Math.floor(Math.random() * responses.length)];

    const updatedMsgs = JSON.parse(localStorage.getItem("cf_messages")) || [];
    updatedMsgs.push({
      id: "m_auto_" + Date.now(),
      senderId: activePartnerId,
      receiverId: currentUser.id,
      text: randomReply,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem("cf_messages", JSON.stringify(updatedMsgs));
    renderChatMessages();
  }, 1000);
}