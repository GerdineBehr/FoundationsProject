const express = require("express");
const router = express.Router();
const { login } = require('../Service/RequestService');
const logger = require('../util/logger');

// POST Login Route
router.post("/", async (req, res) => {
    // Log the incoming request body
    console.log("Received Request Body:", req.body);

    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({ message: "Username and Password are required" });
    }

    try {
        const response = await login(Username, Password);
        if (response.message === "Login successful") {
            res.status(200).json(response);
        } else {
            res.status(401).json(response);
        }
    } catch (err) {
        logger.error("Error during login:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
