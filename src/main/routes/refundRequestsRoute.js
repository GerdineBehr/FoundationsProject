const express = require('express');
const router = express.Router();

// http//localhost:3000/refundRequests

router.get("/", (req, res) => {
    res.send("This is the root refundRequest route "); 
})

function validateRefundRequestMiddleware(req, res, next){
    //Check if there is a valid name and price
    let jsonBody = req.body; 
    if(validateRefundRequestMiddleware(jsonBody)){
        next();
    }else{
        res.status(400).json({
            message: "Invalid Entry"
        })
    }
}

module.exports = router; 

