const http = require('http');
const { createLogger, transports, format } = require('winston');
require('dotenv').config();
const {account} = require('../Model/Model.js'); 

// const accountTest = new account; //JUST A TEST, DELETE AFTER

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

const TableName = "RefundRequestData";


//Set up Commands 

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

async function getRefundRequest(){
    const command = new ScanCommand({
        TableName, 
    });
    try{
        const data = await documentClient.send(command);
        return data.RefundRequest;
    } catch(err){
    logger.error(err);
    throw err;
    }
}

module.exports = { 
    getRefundRequest, 
    postRefundRequest
}





/*
class RequestDAO{ //Creating Request class to encapsulate and organize database interactions) 
    constructor(docuumentClient, tableName){
        this.documentClient = documentClient;
        this.tableName = tableName;
    }
   // Create new Request 
    async createRequest(requestNumber, amount, description, status, accountID){
        const refundRequest = new PutCommand({
            
            TableName: this.tableName,
            RequestNumber: this.requestNumber,
            Amount: this.amount,
            Description: this.description,
            Status: this.status,
            AccountID: this.accountID

        });
        try{ 

        } catch (err){ 
            console.error('Error creating request', err);
            throw err;
        }
    } 

    //Check For Request By Request Number
    async viewRequest(requestNumber){
        const userLogin = new GetCommand({
            TableName: this.tableName,
            RequestNumber: this.requestNumber
        });
        try{
        } catch(err){
            console.log('Error getting request', err);
            throw err;
        }
        }
    //List Requests
    async viewAllRequests(){
        const userLogin = new GetCommand({
            TableName: this.tableName,
            AccountID: this.accountID
        });
        try{
        } catch(err){
            console.log('Error getting requests', err);
            throw err;
        }
}
 }
 

 module.exports = RequestDAO;



/*
Reimbursement info:
-Amount
-Description
-Status
-Employee ID 
 */