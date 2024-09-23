const express = require("express");
const router = express.Router();  
const refundRequestService = require("../Service/RequestService"); 

// POST Create new Refund Request
router.post("/", async (req, res) => {
    try {
        const data = await refundRequestService.postRefundRequest(req.body);
        if (data && data.Attributes) { // Assuming `data.Attributes` contains the created item
            res.status(201).json({ message: `Created Refund Request ${data.Attributes.RequestNumber}` });
        } else { 
            res.status(400).json({ message: "Refund Request not created", receivedData: req.body });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET Read all Refund Requests
router.get("/", async (req, res) => {
    try {
        const data = await refundRequestService.getRefundRequest();
        if (data && data.length > 0) {
            res.status(200).json(data);
        } else { 
            res.status(404).json({ message: "No Refund Requests found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
