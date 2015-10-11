/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-03 15:54:53
 * @version 1.0
 */

var AV   = require('avoscloud-sdk').AV;
var Comment = require('../models/comment');
var Item = require('../models/item');

var comments = {
  add: function (object) {
    // object:
    //   content(*)
    //   item(*)
    //   destId
    var comment = new Comment();

    comment.set('content', object.content);

    // 关联作者，为当前用户
    comment.set('author', AV.User.current());

    // 关联物品
    if (!(object.item instanceof Item)) {
      // TODO: handle error
    };
    comment.set('item', object.item);

    var query = new AV.Query(AV.User);

    return query.get(object.destId)
      .then(function (user) {
        // 关联回复对象
        comment.set('replyTo', user);
      })
      .catch(function (error) {
        // TODO: handle error
      })
      .finally(function () {
        return comment.save();
      });
  },
  destory: function (object) {

  },
  edit: function () {},
  read: function (object) {
    // object:
    //   id - for comment
    var query = new AV.Query(Comment);
    return query.get(object.id);
  }
};

module.exports = comments;
