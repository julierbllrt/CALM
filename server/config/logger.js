var winston = require('winston');
 
var logger = new (winston.Logger)({
    transports: [
       new (winston.transports.File)({
           filename: 'logs.txt',
           level: 'info',
           timestamp: true
           }),
       new (winston.transports.Console)({level: 'debug'})
    ]
});

module.exports = logger;