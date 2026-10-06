// ConnectFriend Messaging Controller - v1.0

let activeFriendId = null;

document.addEventListener("DOMContentLoaded", () => {
  const friends = getData("cf_friends") || [];
  if (friends.length > 0) activeFriendId = friends[0].id;
  renderFriendsList();
  renderActiveChatHeader();
  renderMessages();
});

function renderFriendsList() {
  const friends = getData("cf_friends") || [];
  const container = document.getElementById("chat-friends-list");
  if (!container) return;

  if (friends.length === 0) {
    container.innerHTML = `<p class="text-xs text-gray-400 italic p-2">No friends to message.</p>`;
    return;
  }

  container.innerHTML = friends.map(friend => {
    const active = friend.id === activeFriendId;
    return `
            <div onclick="selectChat(${friend.id})"
                class="p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-all
                ${active ? 'bg-teal-900 text-white shadow-md' : 'hover:bg-white/80 text-gray-800'}">
                <img src="${friend.avatar}" class="w-10 h-10 rounded-xl object-cover" alt="">
                <div>
                    <h5 class="text-xs font-bold">${friend.name}</h5>
                    <span class="text-[10px] font-semibold ${active ? 'text-teal-300' : 'text-gray-500'}">${friend.handle}</span>
                </div>
            </div>
        `;
  }).join("");
}

function selectChat(friendId) {
  activeFriendId = friendId;
  renderFriendsList();
  renderActiveChatHeader();
  renderMessages();
}

function renderActiveChatHeader() {
  const friends = getData("cf_friends") || [];
  const friend = friends.find(f => f.id === activeFriendId);
  if (!friend) return;

  document.getElementById("active-chat-avatar").src = friend.avatar;
  document.getElementById("active-chat-name").innerText = friend.name;
  document.getElementById("active-chat-status").innerText = friend.status || "Online";
}

function renderMessages() {
  const data = getData("cf_messages") || {};
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const thread = data[activeFriendId] || [];

  if (thread.length === 0) {
    container.innerHTML = `<div class="text-center text-xs text-gray-400 py-10">No messages yet. Say hi!</div>`;
    return;
  }

  container.innerHTML = thread.map(msg => {
    const isMe = msg.sender === "You";
    return `
            <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[75%] px-4 py-3 rounded-2xl text-xs font-medium shadow-sm
                    ${isMe ? 'bg-teal-800 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}">
                    <p>${msg.text}</p>
                    <span class="block text-[9px] mt-1 ${isMe ? 'text-teal-300 text-right' : 'text-gray-400'}">${msg.time}</span>
                </div>
            </div>
        `;
  }).join("");

  container.scrollTop = container.scrollHeight;
}

function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (!text || !activeFriendId) return;

  const data = getData("cf_messages") || {};
  if (!data[activeFriendId]) data[activeFriendId] = [];

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  data[activeFriendId].push({ sender: "You", text: text, time: time });

  saveData("cf_messages", data);
  input.value = "";
  renderMessages();
}