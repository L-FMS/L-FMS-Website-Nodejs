/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 16:18:18
 * @version 1.0
 */

var express  = require('express');
var frontend = require('../controllers/frontend');
var AV       = require('avoscloud-sdk').AV;

var baseUri  = '/';

var frontendRoutes = function () {
  var router = express.Router();

  router.all('*', function (req, res, next) {
    var currentUser = AV.User.current();
    res.data = {}; // init
    if (currentUser) {
      res.data.currentUser = {
        name: currentUser.get('name'),
        id: currentUser.id
      };
    }

    next();
  });

  // Process parameters first
  router.param('userId', function (req, res, next, userId) {
    req.data = { id: userId, mark: 'user data' };
    next();
  });

  router.param('itemId', function (req, res, next, itemId) {
    req.data = { id: itemId, mark: 'item data' };
    next();
  });

  router.param('itemType', function (req, res, next, itemType) {
    if (itemType !== 'lost' && itemType !== 'found') {
      next(new Error('Wrong item type!'));
      return;
    }

    req.data = { type: itemType, mark: 'item data' };
    next();
  });

  // GET home page.
  router.get('/', frontend.homepage);

  // GET login page
  router.get('/login', frontend.loginPage)

  // GET join page
  router.get('/join', frontend.joinPage);

  // GET user page
  router.get('/users/:userId', frontend.userPage);

  // GET item page
  router.get('/items/:itemId', frontend.itemDetailPage);

  // Get post items page
  router.get('/items/new/:itemType', frontend.postItemPage);

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

  // Search
  router.get('/search', frontend.searchResultPage);

  router.get('/map', frontend.mapPage);

  return router;
};

module.exports = frontendRoutes;
module.exports.baseUri = baseUri;
