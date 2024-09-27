// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware for authenticating JWT tokens
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(403).json({ message: "Forbidden: Invalid token", error: err.message });
            }
            req.user = user;
            next();
        });
    } else {
        console.error("JWT Token Error: No token provided");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
}

// Middleware for checking the user's role
function checkRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
        }
    };
}

module.exports = {
    authenticateJWT,
    checkRole
};
