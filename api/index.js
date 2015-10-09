/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 17:21:28
 * @version 1.0
 */
var users    = require('./users');
var items    = require('./items');
var comments = require('./comments');

var http = function (apiMethod) {
  return function (req, res, next) {
    var object = req.data || null;
    delete object.mark;

    return apiMethod(object)
      .then(function onSuccess(result) {
        res.json(result);
      })
      .catch(function onError(error) {
        res.send('Error: ' + error.code + ' ' + error.message);
      });
  };
};

module.exports = {
    http: http,
    // API Endpoints
    users: users,
    items: items,
    comments: comments
};
