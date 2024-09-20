




/*
Reimbursement info:
-Amount
-Description
-Status
-Employee ID 
 */

class RequestDAO{ //Creating Request class to encapsulate and organize database interactions) 
    constructor(docuumentClient, tableName){
        this.documentClient = documentClient;
        this.tableName = tableName;
    }
   // Create new Request 
    async createRequest(requestNumber, amount, description, status, accountID){
        const userAccount = new PutCommand({
            
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