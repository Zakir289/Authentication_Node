'use strict'


var authController = require('./controllers/Auth/LoginController').authOperations;
var registrationController = require('./controllers/Auth/RegistrationController');
var roleManager = require('./controllers/Roles/Rolemanager').roleManager;

module.exports = function (app) {
  app.route('/api/v1/login').post(authController.login);
  app.route('/api/v1/login').put(authController.updatePassword);
  app.route('/api/v1/register').post(registrationController.register);
  app.route('/api/v1/user').get(authController.listUsers);
  };
