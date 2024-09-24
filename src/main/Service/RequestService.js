const refundRequestDao = require("../DAO/RequestDAO");
const uuid = require("uuid");

async function postRefundRequest(refundRequest) {
    if (validateRefundRequest(refundRequest)) {
        try {
            let data = await refundRequestDao.postRefundRequest({
                ...refundRequest, 
                RequestNumber: uuid.v4(), 
                Status: "Pending"
            });
            return data;
        } catch (err) {
            console.error("Error creating refund request:", err);
            throw new Error("Internal Server Error");
        }
    }
    throw new Error("Invalid refund request data");
}

function validateRefundRequest(refundRequest) {
    return (refundRequest.AccountID && refundRequest.Amount);
}

async function getRefundRequestsByAccountId(accountId) {
    try {
        const data = await refundRequestDao.fetchRefundRequestsByAccountId(accountId);
        console.log(data);
        if (!data || data.length === 0) {
            throw new Error("No refund requests found for this account");
        }
        return data;
    } catch (err) {
        console.error("Error retrieving refund requests:", err.message);
        throw new Error(err.message || "Internal Server Error");
    }
}

async function getPendingRefundRequests() {
    try {
        const data = await refundRequestDao.fetchPendingRefundRequests();
        if (!data || data.length === 0) {
            throw new Error("No pending refund requests found");
        }
        return data;
    } catch (err) {
        console.error("Error retrieving pending refund requests:", err.message);
        throw new Error(err.message || "Internal Server Error");
    }
}

// Get Refund Requests by AccountID and Status
async function getRefundRequestsByAccountIdAndStatus(accountId, status) {
    try {
        const data = await refundRequestDao.fetchRefundRequestsByAccountIdAndStatus(accountId, status);
        if (!data || data.length === 0) {
            throw new Error(`No refund requests with status "${status}" found for this account`);
        }
        return data;
    } catch (err) {
        console.error(`Error retrieving refund requests by AccountID and Status: ${err.message}`);
        throw new Error(err.message || "Internal Server Error");
    }
}

// Get Refund Requests by AccountID excluding a Status
async function getRefundRequestsByAccountIdExcludingStatus(accountId, status) {
    try {
        const data = await refundRequestDao.fetchRefundRequestsByAccountIdExcludingStatus(accountId, status);
        if (!data || data.length === 0) {
            throw new Error(`No refund requests excluding status "${status}" found for this account`);
        }
        return data;
    } catch (err) {
        console.error(`Error retrieving refund requests by AccountID excluding Status: ${err.message}`);
        throw new Error(err.message || "Internal Server Error");
    }
}

module.exports = {
    postRefundRequest,
    getRefundRequestsByAccountId,
    getPendingRefundRequests,
    getRefundRequestsByAccountIdAndStatus, // Export new function
    getRefundRequestsByAccountIdExcludingStatus // Export new function
};
