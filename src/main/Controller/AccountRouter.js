const express = require("express");
const router = express.Router();  

const accountService = require("../Service/AccountService"); 

// POST Create new account
router.post("/", async (req, res) => {
    try {
        const data = await accountService.postAccount(req.body);
        if (data) {
            res.status(201).json({ message: `Created Account ${data}` });
        } else { 
            res.status(400).json({ message: "Account not created", receivedData: req.body });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// GET Read all accounts
router.get("/", async (req, res) => {
    try {
        const data = await accountService.getAccount();
        if (data && data.length > 0) {
            res.status(200).json(data);
        } else { 
            res.status(404).json({ message: "No accounts found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
