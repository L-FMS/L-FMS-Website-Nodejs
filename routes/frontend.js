/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 16:18:18
 * @version 1.0
 */

var express = require('express');
var frontend = require('../controllers/frontend');
var AV = require('avoscloud-sdk').AV;

var baseUri = '/';

var frontendRoutes = function () {
  var router = express.Router();

  // GET home page.
  router.get('/', frontend.homepage);

  // GET login page
  router.get('/login', frontend.loginPage)

  // GET join page
  router.get('/join', frontend.joinPage);

  // GET user page
  router.get('/users/:userId', frontend.userPage);

  // Get post items page
  router.param('itemType', function (req, res, next, itemType) {
    if (itemType !== 'lost' && itemType !== 'found') {
      next(new Error('Wrong item type!'));
      return;
    }

    req.item = { type: itemType };
    next();
  });
  router.get('/items/:itemType', frontend.postItemPage);

  // Session login
  router.post('/login', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    AV.User.logIn(email, password)
      .then(function onSuccess(user) {
        res.redirect('/');
      })
      .catch(function onError(error) {
        res.send('Error: ' + error.code + ' ' + error.message);
      });
  });

  // Session logout
  router.get('/logout', function (req, res) {
    AV.User.logOut();
    res.redirect('/');
  });

  return router;
};

module.exports = frontendRoutes;
module.exports.baseUri = baseUri;
