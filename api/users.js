var AV = require('avoscloud-sdk').AV;

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
    query.equalTo('objectId', object.id);
    return query.first();
  },
  all: function () {}
};

module.exports = users;
