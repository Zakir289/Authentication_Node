'use strict'

var chalk = require('chalk'),
  glob = require('glob')

module.exports = function () {
  var envFiles = glob.sync('./server/config/env/' + process.env.NODE_ENV + '.js', {});
  if (!envFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'dev';
  } else {
    console.log(chalk.black.bgWhite('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration'))
  }
}
