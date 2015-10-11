/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-07 20:34:34
 * @version 1.0
 */

var AV = require('avoscloud-sdk').AV;
var Comment = require('./comment');
var Item = AV.Object.extend('Item', {
  getComments: function () {
    var query = new AV.Query(Comment);
    query.equalTo('item', this);
    query.include('author');
    query.include('replyTo');
    return query.find();
  }
});

// Attributes:
// type (Enum): lost, found
// name (String)
// place (String)
// location (AV.GeoPoint)
// image (AV.File)
// tags (Array)
// itemDescription (String)


module.exports = Item;
