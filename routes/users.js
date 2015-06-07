var express = require('express');
var router = express.Router();

var AV = require('avoscloud-sdk').AV;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  var user = new AV.User();
  user.set('username', 'h1994st');
  user.set('password', '1235794');
  user.set('email', 'h1994st@gmail.com');

  // other fields can be set just like with AV.Object
  user.set('mobilePhoneNumber', '18817876224');

  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
      res.send(user);
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      res.send('Error: ' + error.code + ' ' + error.message);
    }
  });
});

module.exports = router;
