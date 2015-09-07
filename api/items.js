/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 14:56:32
 * @version 1.0
 */
var fs = require('fs');
var path = require('path');
var AV = require('avoscloud-sdk').AV;
var Item = require('../models/item');

var items = {
  add: function (object) {
    var imageFile = object.image;
    delete object.image;

    if (imageFile) {
      // Read uploaded file
      var file = new AV.File(imageFile.filename, fs.readFileSync(path.join(process.env.PWD, imageFile.path)));
      file.metaData('format', imageFile.mimetype);
      file.metaData('mime_type', imageFile.mimetype);

      var item = new Item();
      item.set('image', file);

      return item.save(object);
    };
  },
  destory: function () {},
  edit: function () {},
  read: function (object) {
    var query = new AV.Query(Item);
    query.equalTo('objectId', object.id);
    return query.first();
  },
  all: function () {}
};

module.exports = items;
