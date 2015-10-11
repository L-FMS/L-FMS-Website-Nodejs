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
  all: function () {
    var query = new AV.Query(ItemNotification);
    query.equalTo('to', AV.User.current());
    query.include('from');
    return query.find();
  },
  updateAll: function () {
    var query = new AV.Query(ItemNotification);
    query.equalTo('to', AV.User.current());
    query.equalTo('isRead', false);
    query.find()
      .then(function (results) {
        results.forEach(function (result, i) {
          result.set('isRead', true);
          result.save();
        });
      })
      .catch(function (error) {
        // TODO: handle error
      });
  },
  getUnreadNotificationAmount: function () {
    console.log('get unread');
    var query = new AV.Query(ItemNotification);
    query.equalTo('to', AV.User.current());
    query.equalTo('isRead', false);

    return query.count();
  }
};

module.exports = itemNotifications;
