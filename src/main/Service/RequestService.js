const refundRequestDao = require("../DAO/RequestDAO");
const uuid = require("uuid"); 

async function postRefundRequest(refundRequest) {
    // Validate the account
    if (validateRefundRequest(refundRequest)) {
    try{// Destructure refundRquest and add RequestNumber and Status
        let data = await refundRequestDao.postRefundRequest({
            ...refundRequest, // Spread the account properties
            RequestNumber: uuid.v4(), // Add unique AccountID using uuid
            Status: "Pending"
        });
        return data;
    } catch (err){
        console.error("Error creating refund request:", err);
        throw new Error("Internal Server Error");
    }
}
    throw new Error("Invalid refund request data");

}; 

function validateRefundRequest(refundRequest) {
    // Ensure both AccountID and amount exist
    return (refundRequest.AccountID && refundRequest.Amount); // Boolean && operator will return false if either are missing
}

module.exports = {
    postRefundRequest
};
