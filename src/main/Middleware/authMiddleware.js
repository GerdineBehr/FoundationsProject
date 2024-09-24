const refundRequestService = require("../Service/RequestService");

// Middleware to check for roles
function checkRole(role) {
    return async function (req, res, next) {
        const username = req.headers.username || req.query.Username || req.body.Username; // Try multiple sources

        if (!username) {
            return res.status(400).json({ message: "Username is required for role checking" });
        }

        try {
            const userRole = await refundRequestService.getUserRole(username);
            if (userRole === role) {
                next(); // User has the right role
            } else {
                return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
            }
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error", error: err.message });
        }
    };
}

module.exports = {
    checkRole
};
