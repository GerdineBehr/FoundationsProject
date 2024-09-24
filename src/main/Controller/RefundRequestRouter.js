const express = require("express");
const router = express.Router();  
const refundRequestService = require("../Service/RequestService");
const { getRefundRequestsByAccountId, getPendingRefundRequests, getRefundRequestsByAccountIdAndStatus, getRefundRequestsByAccountIdExcludingStatus } = require('../Service/RequestService');
const logger = require('../util/logger');

// POST Create new Refund Request
router.post("/", async (req, res) => {
    try {
        const data = await refundRequestService.postRefundRequest(req.body);
        console.log("Data returned from database:", data);
        if (data) {
            res.status(201).json({ message: "Created Refund Request" });
        } else { 
            res.status(400).json({ message: "Refund Request not created", receivedData: req.body });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for refund requests by AccountID
router.get("/", async (req, res) => {
    const accountId = req.query.AccountID;
    console.log("Received AccountID:", accountId);

    try {
        const refundRequests = await getRefundRequestsByAccountId(accountId);
        console.log("Fetched refund requests:", refundRequests);

        if (refundRequests === undefined || refundRequests.length === 0) {
            return res.status(404).json({ message: "No refund requests found for this account." });
        }

        res.status(200).json(refundRequests);
    } catch (err) {
        logger.error("Error retrieving refund requests:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for refund requests by AccountID and Status
router.get("/status", async (req, res) => {
    const accountId = req.query.AccountID;
    const status = req.query.Status;
    console.log(`Received AccountID: ${accountId} and Status: ${status}`);

    try {
        const refundRequests = await getRefundRequestsByAccountIdAndStatus(accountId, status);
        console.log(`Fetched refund requests with status ${status}:`, refundRequests);

        if (refundRequests === undefined || refundRequests.length === 0) {
            return res.status(404).json({ message: `No refund requests found for this account with status ${status}.` });
        }

        res.status(200).json(refundRequests);
    } catch (err) {
        logger.error(`Error retrieving refund requests by status: ${err}`);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for refund requests by AccountID excluding a Status
router.get("/exclude-status", async (req, res) => {
    const accountId = req.query.AccountID;
    const status = req.query.Status;
    console.log(`Received AccountID: ${accountId} to exclude Status: ${status}`);

    try {
        const refundRequests = await getRefundRequestsByAccountIdExcludingStatus(accountId, status);
        console.log(`Fetched refund requests excluding status ${status}:`, refundRequests);

        if (refundRequests === undefined || refundRequests.length === 0) {
            return res.status(404).json({ message: `No refund requests found for this account excluding status ${status}.` });
        }

        res.status(200).json(refundRequests);
    } catch (err) {
        logger.error(`Error retrieving refund requests by excluding status: ${err}`);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for all pending refund requests
router.get("/pending", async (req, res) => {
    try {
        const pendingRequests = await getPendingRefundRequests();
        console.log("Fetched pending refund requests:", pendingRequests);

        if (pendingRequests === undefined || pendingRequests.length === 0) {
            return res.status(404).json({ message: "No pending refund requests found." });
        }

        res.status(200).json(pendingRequests);
    } catch (err) {
        logger.error("Error retrieving pending refund requests:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
