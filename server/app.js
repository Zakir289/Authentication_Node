'use strict';
require('babel/register');
var mongoose = require('mongoose');
/**
 * Module dependencies.
 */

var init = require('./config/init')(),
    config = require('./config/config'),
    chalk = require('chalk');
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Init the express application
var app = require('./config/server')();

// Start the app by listening on <port>
app.listen(config.port, config.host);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Server running on ' + config.port);
