var AV   = require('avoscloud-sdk').AV;
var ItemNotification = require('../models/itemNotification');

var itemNotifications = {
  add: function (object) {
    // object:
    //   to
    //   type
    //   itemId
    var itemNotification = new ItemNotification();

    itemNotification.set('from', AV.User.current());

    var toUser = AV.Object.createWithoutData('_User', object.to);

    itemNotification.set('to', toUser);

    itemNotification.set('type', object.type);

    var item = AV.Object.createWithoutData('Item', object.itemId);

    itemNotification.set('item', item);

    itemNotification.set('isRead', false);

    return itemNotification.save();
  },
  destory: function () {},
  edit: function () {},
  read: function () {},
  all: function () {}
};

module.exports = itemNotifications;
