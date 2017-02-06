'use strict';

var jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
  httpService = require('../../services/HttpService'),
  userModel = require('../../models/Auth/User'),
  logger = require('../../config/logger'),
  devMode = require('../../config/env/dev'),
  hashingOperations = require('../../utils/SaltHashPassword').hashingOperations;

var validate = function(reqBody, res, msg, cb) {
  var query, errMessage;
  if (reqBody.email) {
    query = {
      email: reqBody.email
    };
    errMessage = "email Id not found";
  }
  else {
    query = {
      phoneNo: reqBody.phoneNo
    };
    // errMessage = "mobile number not found";
  }
  userModel.findOne(
    query, function (err, user) {
      if (err) {
        logger.log('validation mobile/email and password', msg, {
          ErrorCode: err.code,
          ErrorMessage: err.message,
          Name: err.name
        });
        return httpService.unauth(res, "mobile/email validation failed" + err.code + err.message);
      }
      if (!user) {
        return httpService.unauth(res, errMessage);
      } else if (user) {
        if (hashingOperations.Authenticate(reqBody.password, user.passwordHash, user.passwordSalt)) {
          cb(user);
        }
        else {
          return httpService.bad(res, "error code" + 'Authentication failed. Wrong password.');
        }
      }
    });

};


var authOperations = {
  // verifyToken: function (req, res) {
  //   var token = req.body.token || req.query.token || req.headers['x-access-token'];
  //   if (token) {
  //     jwt.verify(token, devMode.secretkey, function (err, decoded) {
  //       if (err) {
  //         return res.json({success: false, message: 'Failed to authenticate token.'});
  //       } else {
  //         //go to other code
  //         res.status(200).send({success: true})
  //       }
  //     });
  //
  //   } else {
  //     // if there is no token
  //     // return an error
  //     return res.status(403).send({
  //       success: false,
  //       message: 'No token provided.'
  //     });
  //
  //   }
  // },
  login: function (req, res) {
    var user = validate(req.body, res, 'Authentication failed', generateToken);
    function generateToken(user) {
    var user = {
      accountId : user.accountId
    }

      var token = jwt.sign(user, devMode.secretkey, {
        expiresIn: "30 days"
      });
        res.json({
        success: true,
        message: 'Have the token',
        token: token
      });
    }
  },

  updatePassword: function (req, res) {
    var reqBody = req.body;
    validate(reqBody, res, 'Password Updation failed', updateNewPassword);
    function updateNewPassword(user) {
      if (user) {
        var passwordData = hashingOperations.saltHashPassword(reqBody.newPassword);
        userModel.findOneAndUpdate(
          user._id,
          {
            'passwordSalt': passwordData.salt,
            'passwordHash': passwordData.passwordHash
          }, function (err, user) {
            if (err) {
              logger.log('error', "Updatig Account member failed", {
                ErrorCode: err.code,
                ErrorMessage: err.message,
                Name: err.name
              });
              return httpService.bad(res, err);
            }
            else {
              return httpService.ok(res, {user: user});
            }
          });
      }
    }
  },

  listUsers: function (req, res) {
    // '_id name email phoneNo'
    userModel.find({}, function (err, users) {
      if (err) {
        logger.log('error', "listing users", {
          ErrorCode: err.code,
          ErrorMessage: err.message,
          Name: err.name
        });
        return httpService.bad(res, err);
      }
      else {
        return httpService.ok(res, {users: users});
      }
    })

  }
}

module.exports.authOperations = authOperations;