const http = require('http');
const { createLogger, transports, format } = require('winston');
require('dotenv').config();




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
const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// Create a DynamoDB client
const dynamoDbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const TableName = "[*INSERT TABLE NAME HERE*]";


// Helper function to send a JSON response
const sendJSONResponse = (res, statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};


switch(req.method) {
    case 'POST': //Post-Create new Username and password **User 
        break;
    case 'POST': //Post-Create new Username and password **Admin
        break;
    case 'POST':
        break;
    default:

}


/*
Reimbursement info:
-Amount
-Description
-Status
-Employee ID 
 
 
 
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