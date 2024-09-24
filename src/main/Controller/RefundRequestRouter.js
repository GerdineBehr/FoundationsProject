const express = require("express");
const router = express.Router();  
const refundRequestService = require("../Service/RequestService");
const { getRefundRequestsByAccountId } = require('../Service/RequestService'); // Ensure this points to the correct file
const logger = require('../util/logger');

// POST Create new Refund Request
router.post("/", async (req, res) => {
    try {
        const data = await refundRequestService.postRefundRequest(req.body);
        console.log("Data returned from database:", data);
        if (data) { // Assuming `data.Attributes` contains the created item
            res.status(201).json({ message: "Created Refund Request" });
        } else { 
            res.status(400).json({ message: "Refund Request not created", receivedData: req.body});
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


// GET route for refund requests
router.get("/", async (req, res) => {
    const accountId = req.query.AccountID; // Extract AccountID from query parameters
    console.log("Received AccountID:", accountId);

    try {
        const refundRequests = await getRefundRequestsByAccountId(accountId); // Call your function to fetch data
        console.log("Fetched refund requests:", refundRequests); // Check what this outputs

        // Check for undefined or empty array
        if (refundRequests === undefined || refundRequests.length === 0) {
            return res.status(404).json({ message: "No refund requests found for this account." });
        }

        res.status(200).json(refundRequests);
    } catch (err) {
        logger.error("Error retrieving refund requests:", err);

        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
