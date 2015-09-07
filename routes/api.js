/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 17:23:09
 * @version 1.0
 */

var express = require('express');
var api = require('../api');
var AV = require('avoscloud-sdk').AV;
var multer = require('multer');

// TODO: Don't need to store in the disk
var upload = multer({ dest: 'uploads/' });

var baseUri = '/api/v1';

function validateAddUserRequest(req, res, next) {
  // TODO: Validate Password

  req.user = {
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
  req.item = {
    'type': req.item.type,
    'name': req.body.name,
    'place': req.body.place,
    'image': req.file,
    'tags': req.body.tags.split(','),
    'description': req.body.description
  };

  next();
}

var apiRoutes = function () {
  var router = express.Router();

  router.param('userId', function (req, res, next, userId) {
    req.user = { id: userId };
    next();
  });

  router.param('itemId', function (req, res, next, itemId) {
    req.item = { id: itemId };
    next();
  });

  router.param('itemType', function (req, res, next, itemType) {
    if (itemType !== 'lost' && itemType !== 'found') {
      next(new Error('Wrong item type!'));
      return;
    }

    req.item = { type: itemType };
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
  router.route('/items/:itemId')
    .get(api.http(api.items.read)) // Get item by itemId
    .put(api.http(api.items.edit)) // Edit item information
    .delete(api.http(api.items.destory)); // Delete item

  router.route('/items/:itemType')
    .get(api.http(api.items.all)) // Get all the items
    .post(upload.single('image'), validatePostItemRequest, api.http(api.items.add)); // Add new item [*]

  return router;
};

module.exports = apiRoutes;
module.exports.baseUri = baseUri;
