const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { createLogger, transports, format } = require('winston');
const uuid = require("uuid");
require('dotenv').config();

// Logger setup
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app.log' })
    ]
});

// DynamoDB client setup
const dynamoDbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);
const TableName = "RefundRequestData";
const AccountTableName = "AccountData"; // Table for account data

// Post Refund Request
async function postRefundRequest(refundRequest) {
    console.log("Refund Request Received:", refundRequest); // Log the input data

    const command = new PutCommand({
        TableName, 
        Item: {
            AccountID: refundRequest.AccountID, // Provide value directly
            Amount: refundRequest.Amount,       // Provide value directly
            Description: refundRequest.Description,
            Status: refundRequest.Status || "Pending",
            RequestNumber: refundRequest.RequestNumber || uuid.v4()
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Successfully added refund request:", data); // Log success
        return data;
    } catch (err) {
        logger.error("Error in postRefundRequest:", err);
        console.error("Error details:", err);
        throw err;
    }
}

// Get Refund Requests by AccountID
async function fetchRefundRequestsByAccountId(accountId) {
    console.log("Fetching refund requests for AccountID:", accountId); // Log the input data

    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "AccountID = :accountId",
        ExpressionAttributeValues: {
            ":accountId": { S: accountId }
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Raw query result:", JSON.stringify(data, null, 2)); // Log the raw query result

        if (!data || !data.Items || data.Items.length === 0) { // Check if data.Items is defined and has elements
            console.log("No refund requests found for AccountID:", accountId);
            return []; // Return an empty array if no items found
        }

        const refundRequest = data.Items.map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Formatted query result:", JSON.stringify(refundRequest, null, 2));
        return refundRequest;
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID:", err);
        throw err;
    }
}

// Get all pending refund requests (Scan with filter)
async function fetchPendingRefundRequests() {
    console.log("Fetching all pending refund requests..."); // Log the operation

    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            '#status': 'Status'
        },
        ExpressionAttributeValues: {
            ":status": { S: "Pending" }
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Raw scan result:", JSON.stringify(data, null, 2)); // Log the raw scan result

        if (!data || !data.Items || data.Items.length === 0) { // Check if data.Items is defined and has elements
            console.log("No pending refund requests found.");
            return []; // Return an empty array if no items found
        }

        const pendingRequests = data.Items.map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Formatted scan result:", JSON.stringify(pendingRequests, null, 2));
        return pendingRequests;
    } catch (err) {
        logger.error("Error fetching pending refund requests:", err);
        throw err;
    }
}

// Get Refund Requests by AccountID and Status
async function fetchRefundRequestsByAccountIdAndStatus(accountId, status) {
    console.log(`Fetching refund requests for AccountID: ${accountId} and Status: ${status}`); // Log the input data

    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "AccountID = :accountId",
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "Status"
        },
        ExpressionAttributeValues: {
            ":accountId": { S: accountId },
            ":status": { S: status }
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Raw query result by status:", JSON.stringify(data, null, 2)); // Log the raw query result

        if (!data || !data.Items || data.Items.length === 0) { // Check if data.Items is defined and has elements
            console.log(`No refund requests found for AccountID: ${accountId} and Status: ${status}`);
            return []; // Return an empty array if no items found
        }

        const refundRequests = data.Items.map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Formatted query result by status:", JSON.stringify(refundRequests, null, 2));
        return refundRequests;
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID and Status:", err);
        throw err;
    }
}

// Get Refund Requests by AccountID excluding a Status
async function fetchRefundRequestsByAccountIdExcludingStatus(accountId, status) {
    console.log(`Fetching refund requests for AccountID: ${accountId} excluding Status: ${status}`); // Log the input data

    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "AccountID = :accountId",
        FilterExpression: "NOT #status = :status",
        ExpressionAttributeNames: {
            "#status": "Status"
        },
        ExpressionAttributeValues: {
            ":accountId": { S: accountId },
            ":status": { S: status }
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Raw query result excluding status:", JSON.stringify(data, null, 2)); // Log the raw query result

        if (!data || !data.Items || data.Items.length === 0) { // Check if data.Items is defined and has elements
            console.log(`No refund requests found for AccountID: ${accountId} excluding Status: ${status}`);
            return []; // Return an empty array if no items found
        }

        const refundRequests = data.Items.map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Formatted query result excluding status:", JSON.stringify(refundRequests, null, 2));
        return refundRequests;
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID excluding Status:", err);
        throw err;
    }
}

// Update Refund Request Status
async function updateRefundRequestStatus(accountId, requestNumber, newStatus) {
    console.log(`Updating refund request status for AccountID: ${accountId}, RequestNumber: ${requestNumber} to Status: ${newStatus}`); // Log the input data

    const command = new UpdateCommand({
        TableName,
        Key: {
            AccountID: { S: accountId }, // Convert to DynamoDB format
            RequestNumber: { S: requestNumber } // Convert to DynamoDB format
        },
        UpdateExpression: "set #status = :newStatus",
        ConditionExpression: "#status = :pendingStatus", // Only update if the current status is "Pending"
        ExpressionAttributeNames: {
            "#status": "Status"
        },
        ExpressionAttributeValues: {
            ":newStatus": { S: newStatus },
            ":pendingStatus": { S: "Pending" } // Condition to ensure it only updates pending requests
        },
        ReturnValues: "UPDATED_NEW"
    });
    
    try {
        const data = await documentClient.send(command);
        console.log("Successfully updated refund request status:", data); // Log success
        return data.Attributes; // Return updated attributes
    } catch (err) {
        logger.error("Error updating refund request status:", err);
        console.error("Error details:", err);
        throw err;
    }
}

// Check Login Credentials
async function login(username, password) {
    console.log(`Checking login credentials for Username: ${username}`); // Log the input data

    const command = new ScanCommand({
        TableName: AccountTableName,
        FilterExpression: "#username = :username AND #password = :password",
        ExpressionAttributeNames: {
            "#username": "Username", 
            "#password": "Password"
        },
        ExpressionAttributeValues: {
            ":username": { S: username },
            ":password": { S: password }
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Raw login result:", JSON.stringify(data, null, 2)); // Log the raw result

        if (!data || !data.Items || data.Items.length === 0) {
            console.log("Invalid login credentials.");
            return false; // Return false if no matching items found
        }

        return data.Items.length > 0; // Return true if credentials match
    } catch (err) {
        logger.error("Error checking login credentials:", err);
        throw err;
    }
}

// Get User Role by Username
async function fetchUserRole(username) {
    // Add this error check
    if (!username) {
        throw new Error("Username is undefined");
    }

    console.log(`Fetching user role for Username: ${username}`); // Log the input data

    const command = new ScanCommand({
        TableName: AccountTableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {
            "#username": "Username"
        },
        ExpressionAttributeValues: {
            ":username": { S: username }
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Raw user role result:", JSON.stringify(data, null, 2)); // Log the raw result

        if (!data || !data.Items || data.Items.length === 0) {
            throw new Error("User not found");
        }

        return data.Items[0].Role.S; // Assuming Role is stored in the table
    } catch (err) {
        logger.error("Error fetching user role:", err);
        throw err;
    }
}

module.exports = {
    postRefundRequest,
    fetchRefundRequestsByAccountId,
    fetchPendingRefundRequests,
    fetchRefundRequestsByAccountIdAndStatus,
    fetchRefundRequestsByAccountIdExcludingStatus,
    updateRefundRequestStatus,
    login,
    fetchUserRole // Export the function
};
