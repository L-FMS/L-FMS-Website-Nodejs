/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 17:07:36
 * @version 1.0
 */

var express = require('express');
var admin = require('../controllers/admin');

var baseUri = '/admin';

var adminRoutes = function () {
  var router = express.Router();

  
  return router;
};

module.exports = adminRoutes;
module.exports.baseUri = baseUri;
