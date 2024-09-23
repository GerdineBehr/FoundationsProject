const express = require("express");
const router = express.Router();  

const accountService = require("../Service/AccountService"); 


router.post("/", async (req, res) => {
    const data = await accountService.postAccount(req.body);
    if(data){
        res.status(201).json({message: `Created Account ${data}`});
    } else { 
         res.status(400).json({message: "Account not created", receivedData: req.body});
    }
})

router.get("/", async (req, res) => {
    try{
    const data = await accountService.getAccount();
    if(data){
        res.status(200).json(data);
    } else { 
         res.status(400).json({message: "No accounts found"});
    }
    } catch (err){
        res.status(500).json({message: "Internal Server Error", error: err.message});
    }
});

module.exports = router;
