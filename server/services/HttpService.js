var _ = require('lodash');
var path = require('path');

var HttpService = {
  file: function(res, file) {
    return res.sendFile(path.resolve('public/' + file));
  },

  send: function(res, msg) {
    return res.send(msg);
  },

  fail: function(res, msg) {
    return res.status(500).send({status: false, reason: msg});
  },

  bad: function(res, msg) {
    return res.status(400).send({status: false, err: msg});
  },

  unauth: function(res, msg) {
    return res.status(401).send({status: false, reason: msg});
  },

  success: function(res, msg) {
    return res.json({status: true, msg: msg});
  },

  failure: function(res, msg) {
    return res.status(400).json({status: false, err: msg});
  },

  ok: function(res, msg) {
    return res.json({status: true, msg: msg});
  },

  model: function(res, err, d, cb) {
    var h = HttpService;
    if(err) {
      console.log(err);
      return h.fail(res, 'Internal server error');
    }
    if(d == undefined) {
      console.trace();
      //return h.fail(res, 'Data is undefined');
    }
    cb(d, res);
  },

  isDef: function(value) {
    return !_.isUndefined(value);
  },

  isUdef: function(value) {
    return _.isUndefined(value);
  }
};

module.exports = HttpService;
