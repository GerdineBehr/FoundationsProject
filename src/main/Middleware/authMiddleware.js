const jwt = require('jsonwebtoken'); // Ensure you have this installed
require('dotenv').config(); // For accessing environment variables

// Middleware for authenticating JWT tokens
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization; // Get the auth header

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract the token from the header

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // Verify the token using your secret
            if (err) {
                console.error("JWT Verification Error:", err); // Log the error for more details
                return res.status(403).json({ message: "Forbidden: Invalid token", error: err.message });
            }
            req.user = user; // Store user information in the request object
            next(); // Proceed to the next middleware/route handler
        });
    } else {
        console.error("JWT Token Error: No token provided"); // Log missing token error
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
}


// Middleware for checking the user's role
function checkRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) { // Check if the user has the required role
            next(); // Proceed to the next middleware/route handler
        } else {
            return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
        }
    };
}

module.exports = {
    authenticateJWT,
    checkRole
};
