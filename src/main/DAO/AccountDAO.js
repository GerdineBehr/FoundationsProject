const http = require('http');
const { createLogger, transports, format } = require('winston');
require('dotenv').config();
const {account} = require('../Model/Model.js'); 

const accountTest = new account; //JUST A TEST, DELETE AFTER

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
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

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

//set up commands

async function postUser(Account){
    const command = new PutCommand({
        TableName, 
        Account
    });
    try{
        const data = await documentClient.send(command);

    } catch (err){
        logger.error(err);
    }
}

async function getUser(){
    const command = new ScanCommand({
        TebleName, 
    });
    try{
        const data = await documentClient.send(command);
        return data.Account;
    } catch(err){
    logger.error(err);
    }
}

module.exports = { 
    getUser, 
    postUser
}
 
 
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