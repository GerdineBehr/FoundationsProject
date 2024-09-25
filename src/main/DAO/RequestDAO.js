const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { 
    DynamoDBDocumentClient, 
    PutCommand, 
    QueryCommand, 
    ScanCommand, 
    UpdateCommand 
} = require("@aws-sdk/lib-dynamodb");
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
    console.log("Refund Request Received:", refundRequest);

    const command = new PutCommand({
        TableName, 
        Item: {
            AccountID: refundRequest.AccountID,
            Amount: refundRequest.Amount,
            Description: refundRequest.Description,
            Status: refundRequest.Status || "Pending",
            RequestNumber: refundRequest.RequestNumber || uuid.v4()
        }
    });
    try {
        const data = await documentClient.send(command);
        console.log("Successfully added refund request:", data);
        return data;
    } catch (err) {
        logger.error("Error in postRefundRequest:", err);
        console.error("Error details:", err);
        throw err;
    }
}

// Get Refund Requests by AccountID
async function fetchRefundRequestsByAccountId(accountId) {
    console.log("Fetching refund requests for AccountID:", accountId);
    console.log("Type of AccountID:", typeof accountId); // Check the type of AccountID

    // Ensure AccountID is explicitly a string
    accountId = String(accountId);
    console.log("Ensured AccountID as String:", accountId);

    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "AccountID = :accountId",
        ExpressionAttributeValues: {
            ":accountId": accountId // Use the string-converted AccountID
        }
    });

    try {
        const data = await documentClient.send(command);
        console.log("Raw query result:", JSON.stringify(data, null, 2));

        if (!data || !data.Items || data.Items.length === 0) {
            console.log("No refund requests found for AccountID:", accountId);
            return [];
        }

        return data.Items;
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID:", err);
        throw err;
    }
}


// Get all pending refund requests
async function fetchPendingRefundRequests() {
    console.log("Fetching all pending refund requests...");

    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            '#status': 'Status'
        },
        ExpressionAttributeValues: {
            ":status": "Pending"
        }
    });
    
    console.log("Generated ScanCommand for fetchPendingRefundRequests:");
    console.log(JSON.stringify(command, null, 2));

    try {
        const data = await documentClient.send(command);
        
        console.log("Raw scan result from database:", JSON.stringify(data, null, 2));

        if (!data || !data.Items || data.Items.length === 0) {
            console.log("No pending refund requests found in the database.");
            return [];
        }

        return data.Items;
    } catch (err) {
        console.error("Error fetching pending refund requests:", err);
        throw err;
    }
}


// Get Refund Requests by AccountID and Status

async function fetchRefundRequestsByAccountIdAndStatus(accountId, status) {
    logger.info(`Fetching refund requests for AccountID: ${accountId} and Status: ${status}`);

    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "AccountID = :accountId",
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "Status"
        },
        ExpressionAttributeValues: {
            ":accountId": accountId.toString(),  // Ensuring accountId is a string
            ":status": status.toString()         // Ensuring status is a string
        }
    });

    logger.info("Generated QueryCommand for fetchRefundRequestsByAccountIdAndStatus:", JSON.stringify(command, null, 2));

    try {
        const data = await documentClient.send(command);
        logger.info("Raw query result by AccountID and Status:", JSON.stringify(data, null, 2));

        if (!data || !data.Items || data.Items.length === 0) {
            logger.warn(`No refund requests found for AccountID: ${accountId} and Status: ${status}`);
            return [];
        }

        return data.Items;
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID and Status:", err);
        logger.error("Failed command details:", JSON.stringify(command, null, 2));
        throw err;
    }
}


// Get Refund Requests by AccountID excluding a Status
async function fetchRefundRequestsByAccountIdExcludingStatus(accountId, status) {
    console.log(`Fetching refund requests for AccountID: ${accountId} excluding Status: ${status}`);

    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "AccountID = :accountId",
        FilterExpression: "#status <> :status",
        ExpressionAttributeNames: {
            "#status": "Status"
        },
        ExpressionAttributeValues: {
            ":accountId": accountId, // AccountID as string
            ":status": status // Status as string
        }
    });

    try {
        console.log("Generated QueryCommand for fetchRefundRequestsByAccountIdExcludingStatus:");
        console.log(JSON.stringify(command, null, 2));
        const data = await documentClient.send(command);
        console.log("Raw query result excluding status:", JSON.stringify(data, null, 2));

        // Check if Items array exists and is not empty
        if (data.Items && data.Items.length > 0) {
            return data.Items;
        } else {
            // Return an empty array with a message if no items are found
            return {
                message: `No refund requests found for AccountID: ${accountId} excluding Status: ${status}`,
                Items: []
            };
        }
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID excluding Status:", err);
        throw err;
    }
}



// Update Refund Request Status
async function updateRefundRequestStatus(accountId, requestNumber, newStatus) {
    console.log(`Updating refund request status for AccountID: ${accountId}, RequestNumber: ${requestNumber} to Status: ${newStatus}`);

    // Ensure that AccountID and RequestNumber are provided as strings to match the schema
    const command = new UpdateCommand({
        TableName: TableName,
        Key: {
            "AccountID": accountId, // If AccountID is a string in your table, no need to use { S: accountId }
            "RequestNumber": requestNumber // If RequestNumber is a string in your table, no need to use { S: requestNumber }
        },
        UpdateExpression: "set #status = :newStatus",
        ConditionExpression: "#status = :pendingStatus",
        ExpressionAttributeNames: {
            "#status": "Status"
        },
        ExpressionAttributeValues: {
            ":newStatus": newStatus, // The new status you're updating to
            ":pendingStatus": "Pending" // The condition to check before updating
        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        console.log("Successfully updated refund request status:", data);
        return data.Attributes;
    } catch (err) {
        logger.error("Error updating refund request status:", err);
        console.error("Error details:", err);
        throw err;
    }
}


// Check Login Credentials
async function login(username, password) {
    console.log(`Checking login credentials for Username: ${username}`);
 
    const command = new ScanCommand({
        TableName: AccountTableName,
        FilterExpression: "#username = :username AND #password = :password",
        ExpressionAttributeNames: {
            "#username": "Username",
            "#password": "Password"
        },
        ExpressionAttributeValues: {
            ":username": username,
            ":password": password
        }
    });
 
    try {
        const data = await documentClient.send(command);
        console.log("Raw login result:", JSON.stringify(data, null, 2));
 
        if (data.Items && data.Items.length > 0) {
            return true;
        } else {
            console.log("Invalid login credentials.");
            return false;
        }
    } catch (err) {
        logger.error("Error checking login credentials:", err);
        throw err;
    }
 }

// Get User Role by Username
async function fetchUserRole(username) {
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
            ":username": username
        }
    });

    try {
        const data = await documentClient.send(command);
        console.log("Raw user role result:", JSON.stringify(data, null, 2)); // Log the raw result

        if (!data || !data.Items || data.Items.length === 0) {
            console.error("User not found:", username);
            throw new Error("User not found");
        }

        return data.Items[0].Role; // Assuming Role is stored in the table and is not nested
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
    fetchUserRole
};
