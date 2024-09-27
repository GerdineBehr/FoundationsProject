// RefundRequestRouter.js
const express = require("express");
const router = express.Router();
const {
    postRefundRequest,
    getRefundRequestsByAccountId,
    getPendingRefundRequests,
    getRefundRequestsByAccountIdAndStatus,
    getRefundRequestsByAccountIdExcludingStatus,
    updateRefundRequestStatus
} = require("../Service/RequestService");
const logger = require('../util/logger');
const { authenticateJWT, checkRole } = require("../Middleware/authMiddleware");

// POST Create new Refund Request (Employee role required)
router.post("/", authenticateJWT, checkRole("Employee"), async (req, res) => {
    try {
        const data = await postRefundRequest(req.body);
        console.log("Data returned from database:", data);
        if (data) {
            res.status(201).json({ message: "Created Refund Request", data });
        } else {
            res.status(400).json({ message: "Refund Request not created", receivedData: req.body });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for refund requests by AccountID (Employee role required)
router.get("/", authenticateJWT, checkRole("Employee"), async (req, res) => {
    const accountId = req.query.AccountID;
    console.log("Received AccountID:", accountId);

    try {
        const refundRequests = await getRefundRequestsByAccountId(accountId);
        console.log("Fetched refund requests:", refundRequests);

        if (!refundRequests || refundRequests.length === 0) {
            return res.status(404).json({ message: "No refund requests found for this account." });
        }

        res.status(200).json(refundRequests);
    } catch (err) {
        logger.error("Error retrieving refund requests:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for all pending refund requests (Manager role required)
router.get("/pending", authenticateJWT, checkRole("Manager"), async (req, res) => {
    try {
        const pendingRequests = await getPendingRefundRequests();
        console.log("Fetched pending refund requests:", pendingRequests);

        if (pendingRequests.length === 0) {
            return res.status(200).json({ message: "No pending refund requests found." });
        }

        res.status(200).json(pendingRequests);
    } catch (err) {
        console.error("Error retrieving pending refund requests:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for refund requests by AccountID and Status (Employee role required)
router.get("/status", authenticateJWT, checkRole("Employee"), async (req, res) => {
    const accountId = req.query.AccountID;
    const status = req.query.Status;
    console.log(`Received AccountID: ${accountId} and Status: ${status}`);

    try {
        const refundRequests = await getRefundRequestsByAccountIdAndStatus(accountId, status);
        console.log(`Fetched refund requests with status ${status}:`, refundRequests);

        if (!refundRequests || refundRequests.length === 0) {
            return res.status(404).json({ message: `No refund requests found for this account with status ${status}.` });
        }

        res.status(200).json(refundRequests);
    } catch (err) {
        logger.error(`Error retrieving refund requests by status: ${err}`);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET route for refund requests by AccountID excluding a Status (Employee role required)
router.get("/exclude-status", authenticateJWT, checkRole("Employee"), async (req, res) => {
    const accountId = req.query.AccountID;
    const status = req.query.Status;
    console.log(`Received AccountID: ${accountId} to exclude Status: ${status}`);

    try {
        const refundRequests = await getRefundRequestsByAccountIdExcludingStatus(accountId, status);
        console.log(`Fetched refund requests excluding status ${status}:`, refundRequests);

        if (!refundRequests || refundRequests.length === 0) {
            return res.status(404).json({ message: `No refund requests found for this account excluding status ${status}.` });
        }

        res.status(200).json(refundRequests);
    } catch (err) {
        logger.error(`Error retrieving refund requests by excluding status: ${err}`);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// PUT route to update refund request status (Manager role required)
router.put("/updateStatus", authenticateJWT, checkRole("Manager"), async (req, res) => {
    const { AccountID, RequestNumber, NewStatus } = req.body;
    try {
        const updatedRequest = await updateRefundRequestStatus(AccountID, RequestNumber, NewStatus);
        res.status(200).json({
            message: "Refund request status updated successfully",
            updatedRequest
        });
    } catch (err) {
        logger.error("Error updating refund request status:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
