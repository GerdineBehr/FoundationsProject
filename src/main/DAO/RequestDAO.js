const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb"); // Import UpdateCommand from lib-dynamodb
const { createLogger, transports, format } = require('winston');
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
    console.log("Refund Request:", refundRequest);

    const command = new PutCommand({
        TableName, 
        Item: refundRequest
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (err) {
        logger.error(err);
        throw err;
    }
}

// Get Refund Requests by AccountID
async function fetchRefundRequestsByAccountId(accountId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "AccountID = :accountId",
        ExpressionAttributeValues: {
            ":accountId": { S: accountId }
        }
    });
    try {
        const data = await documentClient.send(command);
        const refundRequest = (data.Items || []).map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Query result:", JSON.stringify(data, null, 2));
        return refundRequest || [];
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID:", err);
        throw err;
    }
}

// Get all pending refund requests (Scan with filter)
async function fetchPendingRefundRequests() {
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
        const pendingRequests = (data.Items || []).map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Scan result:", JSON.stringify(data, null, 2));
        return pendingRequests || [];
    } catch (err) {
        logger.error("Error fetching pending refund requests:", err);
        throw err;
    }
}

// Get Refund Requests by AccountID and Status
async function fetchRefundRequestsByAccountIdAndStatus(accountId, status) {
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
        const refundRequests = (data.Items || []).map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Query result by status:", JSON.stringify(data, null, 2));
        return refundRequests || [];
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID and Status:", err);
        throw err;
    }
}

// Get Refund Requests by AccountID excluding a Status
async function fetchRefundRequestsByAccountIdExcludingStatus(accountId, status) {
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
        const refundRequests = (data.Items || []).map((item) => ({
            AccountID: item.AccountID.S,
            Amount: item.Amount.N,
            Description: item.Description.S,
            Status: item.Status.S,
            RequestNumber: item.RequestNumber.S
        }));

        console.log("Query result excluding status:", JSON.stringify(data, null, 2));
        return refundRequests || [];
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID excluding Status:", err);
        throw err;
    }
}

// Update Refund Request Status
async function updateRefundRequestStatus(accountId, requestNumber, newStatus) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            AccountID: accountId,
            RequestNumber: requestNumber
        },
        UpdateExpression: "set #status = :newStatus",
        ConditionExpression: "#status = :pendingStatus", // Only update if the current status is "Pending"
        ExpressionAttributeNames: {
            "#status": "Status"
        },
        ExpressionAttributeValues: {
            ":newStatus": newStatus,
            ":pendingStatus": "Pending" // Condition to ensure it only updates pending requests
        },
        ReturnValues: "UPDATED_NEW"
    });
    
    try {
        const data = await documentClient.send(command);
        return data.Attributes; // Return updated attributes
    } catch (err) {
        logger.error("Error updating refund request status:", err);
        throw err;
    }
}

// Check Login Credentials
async function login(username, password) {
    const command = new ScanCommand({ // Use Scan instead of Query to check Username and Password
        TableName: AccountTableName,
        FilterExpression: "Username = :username AND Password = :password",
        ExpressionAttributeValues: {
            ":username": username,
            ":password": password
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items.length > 0; // Return true if credentials match
    } catch (err) {
        logger.error("Error checking login credentials:", err);
        throw err;
    }
}

module.exports = {
    postRefundRequest,
    fetchRefundRequestsByAccountId,
    fetchPendingRefundRequests,
    fetchRefundRequestsByAccountIdAndStatus,
    fetchRefundRequestsByAccountIdExcludingStatus,
    updateRefundRequestStatus, // Export the new function
    login
};
