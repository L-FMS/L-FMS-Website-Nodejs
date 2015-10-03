/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-03 15:49:46
 * @version 1.0
 */

var AV = require('avoscloud-sdk').AV;
var Comment = AV.Object.extend("Comment");

// Attributes:
// content (String)
// author (AV.User)
// item (Item)
// time (Date)
// replyTo (AV.User)



module.exports = Comment;
