const express = require('express');
const router = express.Router();

// http//localhost:3000/refundRequests

router.get("/", (req, res) => {
    res.send("This is the root refundRequest route "); 
})

module.exports = router; 

