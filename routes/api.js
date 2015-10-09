/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 17:23:09
 * @version 1.0
 */

var express = require('express');
var api     = require('../api');
var AV      = require('avoscloud-sdk').AV;
var multer  = require('multer');

// TODO: Don't need to store in the disk
var upload  = multer({ dest: 'uploads/' });

var baseUri = '/api/v1';

// Validator
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
    'destId': req.body.destId
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

var apiRoutes = function () {
  var router = express.Router();

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
    req.data = { type: itemType, mark: 'item data' };
    next();
  });

  // Users
  router.route('/users/:userId')
    .get(api.http(api.users.read)) // Get user by userId
    .put(api.http(api.users.edit)) // Edit user information
    .delete(api.http(api.users.destory)); // Delete user

  router.route('/users')
    .get(api.http(api.users.all)) // Get all the users
    .post(validateAddUserRequest, api.http(api.users.add)); // Add new user [*]

  // Items
  router.route('/items/new/:itemType')
    .post(upload.single('image'), validatePostItemRequest, api.http(api.items.add)); // Add new item [*]

  router.route('/items')
    .get(extractItemType, api.http(api.items.all)); // Get all the items

  router.route('/items/:itemId')
    .get(api.http(api.items.read)) // Get item by itemId
    .put(api.http(api.items.edit)) // Edit item information
    .delete(api.http(api.items.destory)); // Delete item

  router.route('/items/:itemId/comments')
    .get(api.http(api.items.getComments))
    .post(validateCommentRequest, api.http(api.comments.add));

  return router;
};

module.exports = apiRoutes;
module.exports.baseUri = baseUri;
