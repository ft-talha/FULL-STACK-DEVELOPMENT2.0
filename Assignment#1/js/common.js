// Shared application state and mock database using localStorage

// Initialize default mock database if not present
function initDatabase() {
  if (!localStorage.getItem("cf_users")) {
    const initialUsers = [
      {
        id: "u1",
        username: "alex",
        password: "123",
        name: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        bio: "Web developer, tech enthusiast, and coffee lover. Building cool UIs!",
        lastLogin: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
        ignoreList: []
      },
      {
        id: "u2",
        username: "sarah",
        password: "123",
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        bio: "UI/UX Designer and nature photographer.",
        lastLogin: new Date(Date.now() - 2 * 60000).toISOString(), // 2 mins ago
        ignoreList: []
      },
      {
        id: "u3",
        username: "john",
        password: "123",
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        bio: "Software Engineer & Outdoor explorer.",
        lastLogin: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
        ignoreList: []
      },
      {
        id: "u4",
        username: "dave_strict",
        password: "123",
        name: "Dave Miller",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        bio: "Privacy advocate. Requesting access requires permission.",
        lastLogin: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
        ignoreList: ["u1"] // Dave has ignored Alex to test ignore requirement
      }
    ];
    localStorage.setItem("cf_users", JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem("cf_friends")) {
    // Default friends for Alex (u1)
    const initialFriends = [
      { userId: "u1", friendId: "u2" },
      { userId: "u2", friendId: "u1" },
      { userId: "u1", friendId: "u3" },
      { userId: "u3", friendId: "u1" }
    ];
    localStorage.setItem("cf_friends", JSON.stringify(initialFriends));
  }

  if (!localStorage.getItem("cf_ratings")) {
    // Ratings: 1 = Stupid (💩), 2 = Cool (😎), 3 = Trustworthy (🛡️)
    const initialRatings = [
      { raterId: "u1", targetId: "u2", rating: 3 },
      { raterId: "u1", targetId: "u3", rating: 2 }
    ];
    localStorage.setItem("cf_ratings", JSON.stringify(initialRatings));
  }

  if (!localStorage.getItem("cf_posts")) {
    const initialPosts = [
      {
        id: "p1",
        authorId: "u2",
        content: "Just finished designing a new mobile app dashboard! Loving the olive green palette.",
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        audience: "all",
        likes: ["u1"],
        dislikes: []
      },
      {
        id: "p2",
        authorId: "u3",
        content: "Anyone up for weekend hiking? Planning to hit the trail early Saturday morning!",
        timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
        audience: "all",
        likes: [],
        dislikes: ["u2"]
      }
    ];
    localStorage.setItem("cf_posts", JSON.stringify(initialPosts));
  }

  if (!localStorage.getItem("cf_invitations")) {
    localStorage.setItem("cf_invitations", JSON.stringify([]));
  }

  if (!localStorage.getItem("cf_messages")) {
    const initialMessages = [
      { id: "m1", senderId: "u2", receiverId: "u1", text: "Hey Alex! Welcome back to ConnecFriend.", timestamp: new Date().toISOString() }
    ];
    localStorage.setItem("cf_messages", JSON.stringify(initialMessages));
  }
}

// Get Logged In User
function getCurrentUser() {
  const userJson = localStorage.getItem("cf_current_user");
  return userJson ? JSON.parse(userJson) : null;
}

// Check session authorization
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
  }
  return user;
}

// Format relative time helper
function formatTimeAgo(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Logout helper
function logout() {
  localStorage.removeItem("cf_current_user");
  window.location.href = "index.html";
}

// Execute DB init on script load
initDatabase();