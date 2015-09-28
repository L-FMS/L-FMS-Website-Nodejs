var AV = require('avoscloud-sdk').AV;
var Item = require('../models/item');

var users = {
  add: function (object) {
    var user = new AV.User();
    user.set('username', object.email);
    user.set('password', object.password);
    user.set('email', object.email);

    return user.signUp(object.userInfo);
  },
  destory: function () {

  },
  edit: function () {},
  read: function (object) {
    var query = new AV.Query(AV.User);
    return query.get(object.id);
  },
  all: function () {},
  getLostItems: function (userId) {
    var query = new AV.Query(Item);
    var user = new AV.User();
    user.id = userId;
    query.equalTo('user', user);
    query.equalTo('type', 'lost');
    return query.find();
  },
  getFoundItems: function (userId) {
    var query = new AV.Query(Item);
    var user = new AV.User();
    user.id = userId;
    query.equalTo('user', user);
    query.equalTo('type', 'found');
    return query.find();
  }
};

module.exports = users;
