'use strict';
var crypto = require('crypto'),
  passwordLength = 16;

// generates random string of characters i.e salt

var genRandomString = function (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

var sha512 = function (password, salt) {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  var passwordHash = hash.digest('hex');
  return passwordHash;
};

function saltHashPassword(password) {
  var salt = genRandomString(passwordLength);
  var passwordHash = sha512(password, salt);
  return {
    salt: salt,
    passwordHash: passwordHash
  };
}

var hashingOperations = {
// hash password with sha512.

  saltHashPassword: function (password) {
    var salt = genRandomString(passwordLength);
    var passwordHash = sha512(password, salt);
    return {
      salt: salt,
      passwordHash: passwordHash
    };
  },

  Authenticate: function (password, passwordHash, salt) {
    var currentPasswordHash = sha512(password, salt);
    if (currentPasswordHash == passwordHash) {
      return true;
    }
    else {
      return false;
    }
  }

};

module.exports.hashingOperations = hashingOperations;

if (require.main === module) {
  hashingOperations.saltHashPassword('rikaz')
}