const http = require('http');
const { createLogger, transports, format } = require('winston');
require('dotenv').config();
const { account } = require('../Model/Model.js');

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

// Setup Database 
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

console.log("AWS_REGION: ", process.env.AWS_REGION);

// Create a DynamoDB client
const dynamoDbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const TableName = "AccountData";

// Function to post a new account to the database
async function postAccount(account) {
    const command = new PutCommand({
        TableName, 
        Item: account
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (err) {
        logger.error("Error creating account:", err);
        throw err;
    }
}

// Function to get all accounts from the database
async function getAccount() {
    const command = new ScanCommand({
        TableName,
    });
    try {
        const data = await documentClient.send(command);
        return data.Account;
    } catch (err) {
        logger.error("Error fetching accounts:", err);
        throw err;
    }
}

// Function to get an account by username to check uniqueness
async function getAccountByUsername(username) {
    const command = new QueryCommand({
        TableName,
        IndexName: "Username-index", // Assuming you have a GSI on Username
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {
            "#username": "Username"
        },
        ExpressionAttributeValues: {
            ":username": username
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items.length > 0 ? data.Items[0] : null; // Return the first matching account, or null if not found
    } catch (err) {
        logger.error("Error fetching account by username:", err);
        throw err;
    }
}

module.exports = {
    getAccount,
    postAccount,
    getAccountByUsername
};

 // USER FACING 


// POST Create new Username and password 

// GET Read if username exists

// POST Login User 

// POST Create Reimbursement request 

// GET Read status of reimbursement request 

//


// ADMIN FACING 

// POST Create new Username and password 

// GET Read if username exists

// POST login 

// GET Read Reimbursement request 

// PUT Update Reimbursement ticket to approved/denied;*/