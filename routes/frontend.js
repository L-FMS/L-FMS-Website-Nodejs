/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 16:18:18
 * @version 1.0
 */

var express  = require('express');
var frontend = require('../controllers/frontend');
var AV       = require('avoscloud-sdk').AV;
var multer   = require('multer');
var api = require('../api');

var upload   = multer({ dest: 'uploads/' });

var baseUri  = '/';

// Validator
function validateLogin(req, res, next) {
  var currentUser = AV.User.current();
  if (!currentUser) {
    next(new Error('请先登录'));
    return;
  };
  next();
};

function validateUpdateUserRequest(req, res, next) {
  req.data = {
    'mark': 'user data',
    'name': req.body.name,
    'gender': req.body.gender == 0 ? 'male' : 'female',
    'birth': new Date(req.body.birth),
    'mobilePhoneNumber': req.body.phone,
    'major': req.body.major,
    'address': req.body.address
  };

  next();
};

function validateAddUserRequest(req, res, next) {
  // TODO: Validate Password

  req.data = {
    'mark': 'user data',
    'email': req.body.email,
    'password': req.body.password,
    'userInfo': {
      'name': req.body.name,
      'gender': req.body.gender == 0 ? 'male' : 'female',
      'birth': new Date(req.body.birth),
      'mobilePhoneNumber': req.body.phone,
      'major': req.body.major,
      'address': req.body.address
    }
  };

  next();
};

function validatePostItemRequest(req, res, next) {
  console.log('validate post item request');

  if (req.data.mark !== 'item data') {
    next(new Error('Wrong request data mark: ' + req.data.mark));
  }

  // 这个point里的都是字符串，之后要转换成float
  var point = req.body.location.split(','); // lat, lng

  req.data = {
    'mark': 'item data',
    'type': req.data.type,
    'name': req.body.name,
    'place': req.body.place,
    'location': new AV.GeoPoint({'latitude': parseFloat(point[0]), 'longitude': parseFloat(point[1])}),
    'image': req.file,
    'tags': req.body.tags.split(','),
    'itemDescription': req.body.itemDescription
  };

  next();
}

function validateCommentRequest(req, res, next) {
  if (req.data.mark !== 'item data') {
    next(new Error('Wrong request data mark: ' + req.data.mark));
  }

  req.data = {
    'mark': 'comment data',
    'content': req.body.content,
    'item': AV.Object.createWithoutData('Item', req.data.id),
    'destId': req.body.destId,
    'itemOwnerId': req.body.itemOwnerId
  };

  next();
}

function extractItemType(req, res, next) {
  console.log('extract item type');
  var itemType = req.query.type;

  if (itemType !== 'lost' || itemType !== 'found' || itemType !== 'all') {
    itemType = 'all'; // Default
  }

  req.data = { type: itemType, mark: 'item data' };

  next();
}

var frontendRoutes = function () {
  var router = express.Router();

  router.all('*', function (req, res, next) {
    var currentUser = AV.User.current();
    res.data = {}; // init
    if (currentUser) {
      // TODO: 获取未读消息数量

      res.data.currentUser = {
        name: currentUser.get('name'),
        id: currentUser.id
      };

      api.itemNotifications.getUnreadNotificationAmount()
        .then(function (count) {
          console.log('count: ' + count);
          res.data.currentUser.unreadNotifications = count;
          next();
        })
        .catch(function (error) {
          // TODO: handle error
          next();
        });
    } else {
      next();
    }
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

  // POST user - add new user, register
  router.post('/users', validateAddUserRequest, frontend.register); // Add new user [*]

  // POST - update user info
  router.post('/users/update', validateLogin, validateUpdateUserRequest, frontend.updateUserInfo);

  // POST - change password
  router.post('/users/changePassword', validateLogin, frontend.changePassword);

  // GET item page
  router.get('/items/:itemId', frontend.itemDetailPage);

  // POST item
  router.post('/items/new/:itemType', validateLogin, upload.single('image'), validatePostItemRequest, frontend.addItem); // Add new item [*]

  // POST comment
  router.post('/items/:itemId/comments', validateLogin, validateCommentRequest, frontend.addComment);

  // Get post items page
  router.get('/items/new/:itemType', validateLogin, frontend.postItemPage);

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

  // Setting
  router.get('/settings', validateLogin, frontend.settingsPage);

  // Notification Center
  router.get('/notificationCenter', validateLogin, frontend.notificationCenterPage);

  // Send sms and email
  router.post('/sendMessage/:userId', validateLogin, frontend.sendMessage);

  // Get notification amount
  // router.get('/getUnreadNotificationAmount', validateLogin, frontend.getUnreadNotificationAmount);

  // router.get('/map', frontend.mapPage);

  return router;
};

module.exports = frontendRoutes;
module.exports.baseUri = baseUri;
