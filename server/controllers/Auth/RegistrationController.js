'use strict';

var httpService = require('../../services/HttpService'),
  userModel = require('../../models/Auth/User'),
  passwordGenerator = require('../../utils/PasswordGenerator'),
  logger = require('../../config/logger'),
  hashingOperations = require('../../utils/SaltHashPassword').hashingOperations;

module.exports = {
  register: function (req, res) {
    var reqBody = req.body, password;
    if (!reqBody.password) {
      password = passwordGenerator.customPassword();
      console.log("password generated for the" + reqBody.name + "  is  " + password);
    }
    else{
      password = reqBody.password;
    }
    var passwordData = hashingOperations.saltHashPassword(password);
    
    var user = new userModel({
      accountId: reqBody.accountId,
      name: reqBody.name,
      email: reqBody.email,
      phoneNo: reqBody.phoneNo,
      passwordSalt: passwordData.salt,
      passwordHash: passwordData.passwordHash
    });

    user.save(function (err, user) {
      if (err) {
        logger.log('error', "user registration failed", {
          ErrorCode: err.code,
          ErrorMessage: err.message,
          Name: err.name
        });
        return httpService.bad(res, "error code" + err.code + err.message);
      }
      else {
        return httpService.ok(res);
      }
    })
  }
};
