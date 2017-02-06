'use strict';
var crypto = require('crypto');

var generateRandomId = function () {
  return crypto.randomBytes(10).toString('hex');
};


module.exports.generateRandomId = generateRandomId;
