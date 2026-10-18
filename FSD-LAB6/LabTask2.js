// Asynchronous Operation 1: Fetch User Profile
async function fetchProfile(id) {
    return { id: id, username: "dev_user", role: "admin" };
}

// Asynchronous Operation 2: Fetch User Permissions
async function fetchPermissions(id) {
    return { id: id, permissions: ["read", "write"] };
}

// Task 2 Implementation
function validateAndFetchAll(userId) {
    return new Promise((resolve, reject) => {
        // Pass two async operations to Promise.all
        Promise.all([fetchProfile(userId), fetchPermissions(userId)])
            .then(([profile, perms]) => {
                // Check if details fetched by both async functions are valid
                const isProfileValid = profile && profile.id && profile.username;
                const isPermsValid = perms && Array.isArray(perms.permissions) && perms.permissions.length > 0;

                if (isProfileValid && isPermsValid) {
                    // Accept the main promise
                    resolve({
                        profile: profile,
                        permissions: perms.permissions
                    });
                } else {
                    // Reject the main promise if validation fails
                    reject(new Error("Validation Failed: Details fetched by async functions are invalid."));
                }
            })
            .catch((error) => {
                // Reject main promise if any promise fails
                reject(new Error(`Operation Failed: ${error.message}`));
            });
    });
}

// Execution and Test Block
console.log("Running Task 2 Tests...");

validateAndFetchAll(1)
    .then((result) => console.log("Main Promise Accepted:", result))
    .catch((error) => console.error("Main Promise Rejected:", error.message));