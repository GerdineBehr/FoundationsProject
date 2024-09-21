
const { createLogger, format, transports } = require('winston');


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
/*
process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error}`);
    process.exit(1);
});
*/

module.exports = logger;