const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
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

// Post Refund Request
async function postRefundRequest(refundRequest){

    console.log("Refund Request:", refundRequest);

    const command = new PutCommand({
        TableName, 
        Item: refundRequest
    });
    try{
        const data = await documentClient.send(command);
        return data;

    } catch (err){
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
            ":accountId": {S: accountId}
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


        console.log("Query result:", JSON.stringify(data, null, 2)); // Log the entire query result
        return {refundRequest} || [];  // Return an empty array if Items is undefined
    } catch (err) {
        logger.error("Error fetching refund requests by AccountID:", err);
        throw err;
    }
}


// // Get all refund requests (Scan)
// async function getRefundRequest() {
//     const command = new ScanCommand({
//         TableName,
//     });
//     try {
//         const data = await documentClient.send(command);
//         console.log(data); // Log the data to inspect its structure
//         return data.Items;
//     } catch (err) {
//         logger.error("Error scanning refund requests:", err);
//         throw err;
//     }
// }

module.exports = {
    postRefundRequest,
    fetchRefundRequestsByAccountId,
    //getRefundRequest
};
