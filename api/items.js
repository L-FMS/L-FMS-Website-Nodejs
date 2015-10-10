/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 14:56:32
 * @version 1.0
 */
var fs   = require('fs');
var path = require('path');
var AV   = require('avoscloud-sdk').AV;
var Item = require('../models/item');
var Comment = require('../models/comment');

var items = {
  add: function (object) {
    // object:
    //   type(*)
    //   name(*)
    //   place(*)
    //   location(*)
    //   image(*)
    //   tags(*) TODO: 应该是个可选项
    //   itemDescription(*)
    console.log('add item');
    var imageFile = object.image;
    delete object.image;

    if (imageFile) {
      // Read uploaded file
      var file = new AV.File(imageFile.filename, fs.readFileSync(path.join(process.env.PWD, imageFile.path)));
      file.metaData('format', imageFile.mimetype);
      file.metaData('mime_type', imageFile.mimetype);

      var item = new Item();
      item.set('image', file);

      // TODO: 关联Tag
      // 本想将Tag分开到一个表
      // 但问题在于不能每次都向LeanCloud请求Tag表的相关信息

      // 关联用户
      item.set('user', AV.User.current());

      // 关联地理信息
      item.set('location', object.location);
      delete object.location;

      console.log(object);

      return item.save(object);
    };
  },
  destory: function () {},
  edit: function () {},
  read: function (object, includeUser) {
    var query = new AV.Query(Item);
    if (includeUser) {
      query.include('user');
    };
    return query.get(object.id);
  },
  all: function (object) {
    var type = object.type;
    var query = new AV.Query(Item);
    if (type !== 'all') {
      query.equalTo('type', type);
    };
    return query.find();
  },
  find: function (keywords) {
    var nameQuery = new AV.Query(Item);
    nameQuery.contains('name', keywords);

    var tagQuery = new AV.Query(Item);
    tagQuery.equalTo('tags', keywords);

    var descriptionQuery = new AV.Query(Item);
    descriptionQuery.contains('itemDescription', keywords);

    var placeQuery = new AV.Query(Item);
    placeQuery.contains('place', keywords);

    var mainQuery = new AV.Query.or(nameQuery, tagQuery, descriptionQuery, placeQuery);

    return mainQuery.find();
  },
  getComments: function (object) {
    var item = AV.Object.createWithoutData('Item', object.id);
    var query = new AV.Query(Comment);
    query.equalTo('item', item);
    query.include('replyTo');
    return query.find();
  }
};

module.exports = items;
