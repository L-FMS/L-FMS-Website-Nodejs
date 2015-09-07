/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 15:45:46
 * @version 1.0
 */
var AV = require('avoscloud-sdk').AV;
var api = require('../api');

var frontendControllers = {
  'homepage': function (req, res, next) {
    var data = { title: '首页 | 失物招领管理系统' };

    var currentUser = AV.User.current();
    if (currentUser) {
      data.user = {
        name: currentUser.get('name'),
        id: currentUser.id
      };
    }

    res.render('index', data);
  },
  'loginPage': function (req, res, next) {
    res.render('login', { title: '登录 | 失物招领管理系统' });
  },
  'joinPage': function (req, res, next) {
    res.render('join', { title: '加入 | 失物招领管理系统' });
  },
  'postItemPage': function (req, res, next) {
    if (req.item.type === 'lost') {
      res.render('postLostItem', { title: '发布信息 | 失物招领管理系统' });
    } else if (req.item.type === 'found') {
      res.render('postFoundItem', { title: '发布信息 | 失物招领管理系统' });
    }
  },
  'userPage': function (req, res, next) {
    var data = { title: '个人主页 | 失物招领管理系统' };
    req.user = { id: req.params.userId };
    api.users.read(req.user)
      .then(function (user) {
        data.info = JSON.stringify(user);
        res.render('user', data);
      })
      .catch(function (error) {
        // TODO: handle error
      });
  }
};

module.exports = frontendControllers;
