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
    res.data.title = '首页 | 失物招领管理系统';
    res.render('index', res.data);
  },
  'loginPage': function (req, res, next) {
    res.data.title = '登录 | 失物招领管理系统';
    res.render('login', res.data);
  },
  'joinPage': function (req, res, next) {
    res.data.title = '加入 | 失物招领管理系统';
    res.render('join', res.data);
  },
  'postItemPage': function (req, res, next) {
    res.data.title = '发布信息 | 失物招领管理系统';
    if (req.item.type === 'lost') {
      res.render('postLostItem', res.data);
    } else if (req.item.type === 'found') {
      res.render('postFoundItem', res.data);
    }
  },
  'userPage': function (req, res, next) {
    res.data.title = '个人主页 | 失物招领管理系统';

    AV.Promise.when(api.users.read(req.user), api.users.getLostItems(req.user.id), api.users.getFoundItems(req.user.id))
      .then(function (user, lostItems, foundItems) {
        res.data.user = {
          'id': user.id,
          'name': user.get('name'),
          'email': user.get('email'),
          'birth': user.get('birth').toLocaleString(),
          'gender': user.get('gender') == 'male' ? '男' : '女'
        };

        // Process items array
        res.data.lostCount = lostItems.length;
        res.data.lostItems = [];
        for (var i = 0; i < lostItems.length; i++) {
          var item = lostItems[i];
          res.data.lostItems.push({
            'id': item.id,
            'name': item.get('name'),
            'place': item.get('place'),
            'time': item.createdAt.toLocaleString()
          });
        };

        res.data.foundCount = foundItems.length;
        res.data.foundItems = [];
        for (var i = 0; i < foundItems.length; i++) {
          var item = foundItems[i];
          res.data.foundItems.push({
            'id': item.id,
            'name': item.get('name'),
            'place': item.get('place'),
            'time': item.createdAt.toLocaleString()
          });
        };

        res.render('user', res.data);
      })
      .catch(function (error) {
        // TODO: handle error
      });
  },
  'searchResultPage': function (req, res, next) {
    res.data.title = '搜索结果 | 失物招领管理系统';
    var keywords = req.query.q;

    api.items.find(keywords)
      .then(function (results) {
        res.data.results = [];
        for (var i = 0; i < results.length; i++) {
          var item = results[i];
          console.log(typeof item.createdAt);
          res.data.results.push({
            'id': item.id,
            'name': item.get('name'),
            'place': item.get('place'),
            'time': item.createdAt.toLocaleString(),
            'type': item.get('type')
          });
        };

        res.render('search', res.data);
      })
      .catch(function (error) {
        // TODO: handle error
      });
  },
  'itemDetailPage': function (req, res, next) {
    res.data.title = '物品信息 | 失物招领管理系统'

    api.items.read(req.item, true)
      .then(function (item) {
        var user = item.get('user');
        res.data.user = {
          'id': user.id,
          'name': user.get('name'),
          'phone': user.get('mobilePhoneNumber'),
          'address': user.get('address')
        };
        res.data.item = {
          'id': item.id,
          'name': item.get('name'),
          'place': item.get('place'),
          'time': item.createdAt.toLocaleString(),
          'type': item.get('type'),
          'description': item.get('description'),
          'imageURL': item.get('image').url()
        };

        res.render('detail', res.data);
      })
      .catch(function (error) {
        // TODO: handle error
      });
  }
};

module.exports = frontendControllers;
