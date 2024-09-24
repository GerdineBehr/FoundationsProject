const express = require('express');
const router = express.Router();
const logger = require('../util/logger');



// Middleware for validating refund requests (if needed)
function validateRefundRequestMiddleware(req, res, next) {
    let jsonBody = req.body; 
    if (validateRefundRequest(jsonBody)) { // Ensure you have a validateRefundRequest function
        next();
    } else {
        res.status(400).json({
            message: "Invalid Entry"
        });
    }
}

module.exports = router;
