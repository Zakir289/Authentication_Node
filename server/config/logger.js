const winston = require('winston');
winston.add(winston.transports.File, {filename: 'all-logs.log'});
module.exports = winston;