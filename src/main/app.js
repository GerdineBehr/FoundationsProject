const express = require('express');
const logger = require('./util/logger');
//const refundRequestRouter = require('./routes/refundRequestRoute');  // http//localhost:3000/refundRequests
const refundRequestRouter = require("./Controller/RefundRequestRouter");
//const refundRequestRouter = require("./routes/RequestService");
const accountRouter = require("./Controller/AccountRouter");
//const accountRouter = require('./routes/accountRoute');


const app = express();
const PORT = 3000; 

/**
 * Middleware are functions that can be used to process and modify http requests and responses. 
 * They are used to perform repetitive tasks like logging, authentication, and data validation. 
 * 
 * function middleware(req, res, next){
 * //Perform operation on req and res objects 
 * call next() ot pass control to the next middleware or route handler
 * 
 * nex(); 
 * }
 */

function loggerMiddleware(req, res, next){
    logger.info(` Incoming ${req.method} : ${req.url}`);
    next();
}


// Middleware in order funtion uses them to avoid error

app.use(loggerMiddleware); //Body parser middleware


app.use(express.json()); //Parses incoming and outgoin JSON request for you 

//MISSING  // lets you parse URL encoded form data

//set up logger 
app.use((req, res, next) =>{
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
});

//use the router
app.use("/accounts", accountRouter);

app.use("/refundRequests", refundRequestRouter); // refundRequests endpoint is expected 


app.listen(PORT, () =>{
    logger.info(`Server is listening on port: ${PORT}`);

});
