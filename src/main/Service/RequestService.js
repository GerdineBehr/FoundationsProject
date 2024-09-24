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

async function getRefundRequestsByAccountId(accountId) {
    try {
        const data = await refundRequestDao.fetchRefundRequestsByAccountId(accountId); // Fetch refund requests from DAO
        console.log(data);
        if (!data || data.length === 0) {
            throw new Error("No refund requests found for this account");
        }
        return data; // Return the retrieved refund requests data
    } catch (err) {

        console.error("Error retrieving refund requests:", err.message); // Log the actual error message
        throw new Error(err.message || "Internal Server Error"); // Return specific error message
    }
}








module.exports = {
    postRefundRequest,
    getRefundRequestsByAccountId
};
