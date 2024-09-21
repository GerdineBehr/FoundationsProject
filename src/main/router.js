const express = require('express');
const logger = require('./util/logger');
const app = express();

const PORT = 3000; 


app.listen(PORT, () =>{
    logger.info(`Server is listening on port: ${PORT}`);

});