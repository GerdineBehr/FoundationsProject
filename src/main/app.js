const express = require('express');
const logger = require('./util/logger');
const refundRequestRouter = require("./Controller/RefundRequestRouter");
const accountRouter = require("./Controller/AccountRouter");

const app = express();
const PORT = 3000;

function loggerMiddleware(req, res, next){
    logger.info(` Incoming ${req.method} : ${req.url}`);
    next();
}

app.use(loggerMiddleware); 
app.use(express.json());

app.use("/accounts", accountRouter);
app.use("/refundRequests", refundRequestRouter);

app.listen(PORT, () =>{
    logger.info(`Server is listening on port: ${PORT}`);
});
