/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-07 20:34:34
 * @version 1.0
 */

var AV = require('avoscloud-sdk').AV;
var Comment = require('./comment');
var ItemNotification = AV.Object.extend('ItemNotification');

// Attributes:
// from (AV.User)
// to (AV.User)
// type (Enum): itemConfirm, comment
// item (Pointer: Item)
// isRead (Boolean)

module.exports = ItemNotification;
