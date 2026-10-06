// ConnectFriend Shared State Manager - v1.0

// 1. Default data
const DEFAULT_POSTS = [
    {
        id: 101,
        author: "Sara Ahmed",
        handle: "@sara_a",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        content: "Excited to publish our team's research on futuristic AI node interfaces! ConnectFriend's clean workflow makes sharing updates effortless.",
        tag: "Tech & Innovation",
        likes: 14,
        dislikes: 1,
        timestamp: "2 hours ago"
    },
    {
        id: 102,
        author: "Zaid Malik",
        handle: "@zaid_dev",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        content: "Organizing an open-source web assembly workshop next weekend. Message me if you want to join!",
        tag: "Campus Event",
        likes: 8,
        dislikes: 0,
        timestamp: "5 hours ago"
    }
];

const DEFAULT_FRIENDS = [
    { id: 1, name: "Ali Hassan", handle: "@alih", rating: 4, status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
    { id: 2, name: "Hamza Tariq", handle: "@hamzat", rating: 5, status: "Active", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" },
    { id: 3, name: "Ayesha Khan", handle: "@ayeshak", rating: 5, status: "Away", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }
];

const DEFAULT_INVITATIONS = [
    { id: 201, name: "Bilal Raza", handle: "@bilal_r", mutual: 6, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" },
    { id: 202, name: "Maria Farooq", handle: "@mfarooq", mutual: 3, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" }
];

// Suggested users to send invitations to
const DEFAULT_SUGGESTED = [
    { id: 301, name: "Usman Sheikh", handle: "@usman_s", mutual: 8, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" },
    { id: 302, name: "Fatima Noor", handle: "@fatima_n", mutual: 4, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150" },
    { id: 303, name: "Hassan Raza", handle: "@hassan_r", mutual: 2, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150" }
];

const DEFAULT_MESSAGES = {
    1: [
        { sender: "Ali Hassan", text: "Hey! Did you check out the new design rubric?", time: "10:15 AM" },
        { sender: "You", text: "Yes, working on the front-end modules now!", time: "10:18 AM" }
    ],
    2: [{ sender: "Hamza Tariq", text: "Are we still meeting for project reviews tomorrow?", time: "Yesterday" }],
    3: [{ sender: "Ayesha Khan", text: "Great post today on news sharing!", time: "2 days ago" }]
};

const DEFAULT_USER = {
    name: "Guest User",
    handle: "@guest",
    role: "Student Developer",
    bio: "Building clean web experiences for ConnectFriend.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    skills: ["UI/UX Design", "JavaScript", "Tailwind CSS"],
    github: "",
    linkedin: ""
};

const DEFAULT_DEMO_USERS = [
    { id: "sara", name: "Sara", email: "sara@connectfriend.org", password: "demo123" },
    { id: "ahmed", name: "Ahmed", email: "ahmed@connectfriend.org", password: "demo123" },
    { id: "ali", name: "Ali", email: "ali@connectfriend.org", password: "demo123" }
];

// 2. Init storage
function initStorage() {
    if (!localStorage.getItem("cf_posts")) localStorage.setItem("cf_posts", JSON.stringify(DEFAULT_POSTS));
    if (!localStorage.getItem("cf_friends")) localStorage.setItem("cf_friends", JSON.stringify(DEFAULT_FRIENDS));
    if (!localStorage.getItem("cf_invitations")) localStorage.setItem("cf_invitations", JSON.stringify(DEFAULT_INVITATIONS));
    if (!localStorage.getItem("cf_suggested")) localStorage.setItem("cf_suggested", JSON.stringify(DEFAULT_SUGGESTED));
    if (!localStorage.getItem("cf_messages")) localStorage.setItem("cf_messages", JSON.stringify(DEFAULT_MESSAGES));
    if (!localStorage.getItem("cf_user")) localStorage.setItem("cf_user", JSON.stringify(DEFAULT_USER));
    if (!localStorage.getItem("cf_demo_users")) localStorage.setItem("cf_demo_users", JSON.stringify(DEFAULT_DEMO_USERS));
}

// 3. Safe getters/setters
function getData(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn("Error reading", key, e);
        return null;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getDemoUsers() {
    return getData("cf_demo_users") || DEFAULT_DEMO_USERS;
}

// 4. Toast
function showToast(message, isError = false) {
    const toast = document.getElementById("toast-notification");
    if (!toast) return;
    const toastText = document.getElementById("toast-text");
    toastText.innerText = message;

    const base = "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300";
    if (isError) {
        toast.className = `${base} bg-red-600 text-white opacity-100 translate-y-0`;
    } else {
        toast.className = `${base} bg-teal-800 text-white opacity-100 translate-y-0 border border-teal-500/40`;
    }

    setTimeout(() => {
        toast.className = `${base} bg-teal-800 text-white opacity-0 pointer-events-none translate-y-4`;
    }, 3000);
}

// 5. Session guard
function checkSession() {
    const loggedIn = localStorage.getItem("cf_is_logged_in");
    const page = window.location.pathname.split("/").pop();
    if (!loggedIn && page !== "index.html" && page !== "") {
        window.location.href = "index.html";
    }
}

function logoutUser() {
    localStorage.removeItem("cf_is_logged_in");
    window.location.href = "index.html";
}

initStorage();
checkSession();