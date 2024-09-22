const express = require('express');
const logger = require('./util/logger');
const refundRequestsRouter = require('./routes/refundRequestsRoute'); // http//localhost:3000/refundRequests


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

app.use("./refundRequest", refundRequestsRouter); // lets you parse URL encoded form data

app.use("/refundRequests" , refundRequestsRouter); // refundRequests endpoint is expected 



app.listen(PORT, () =>{
    logger.info(`Server is listening on port: ${PORT}`);

});