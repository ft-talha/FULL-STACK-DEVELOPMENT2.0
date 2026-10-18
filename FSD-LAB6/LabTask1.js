// Simulated API fetcher
function mockApiFetch(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (userId === 1) {
                resolve({ id: 1, name: "John Doe", email: "john@example.com" });
            } else {
                resolve(null); // Simulates a missing user
            }
        }, 1000);
    });
}

// Task 1 implementation using async/await
async function fetchUser(userId) {
    try {
        const user = await mockApiFetch(userId);

        // Validate user object
        if (!user || !user.id || !user.name) {
            throw new Error("Invalid user object returned from API.");
        }

        return user; // Returns valid user
    } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

// Execution block
(async() => {
    console.log("Fetching user...");
    try {
        const userData = await fetchUser(1);
        console.log("Success:", userData);
    } catch (err) {
        console.error("Error:", err.message);
    }
})();