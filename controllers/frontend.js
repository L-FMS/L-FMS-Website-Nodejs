/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 15:45:46
 * @version 1.0
 */
var AV  = require('avoscloud-sdk').AV;
var api = require('../api');

var frontendControllers = {
  'homepage': function (req, res, next) {
    res.data.title = '首页 | 失物招领管理系统';

    // api.items.all()
    //   .then(function (items) {
    //     res.data.lostItems = [];
    //     res.data.foundItems = [];
    //     for (var i = 0; i < results.length; i++) {
    //       var item = results[i];
    //       var type = item.get('item');
    //       var _item = {
    //         'id': item.id,
    //         'name': item.get('name'),
    //         'place': item.get('place'),
    //         'time': item.createdAt.toLocaleString(),
    //         'type': type
    //       };

    //       if (type === 'lost') {
    //         res.data.lostItems.push(_item);
    //       } else if (type === 'found') {
    //         res.data.foundItems.push(_item);
    //       }
    //     };

    //     res.render('index', res.data);
    //   })
    //   .catch(function (error) {
    //     // TODO: handle error
    //   });

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
    if (req.data.mark !== 'item data') {
      next(new Error('Wrong request data mark: ' + req.data.mark));
    }

    res.data.title = '发布信息 | 失物招领管理系统';
    var itemType = req.data.type;
    if (itemType === 'lost') {
      res.render('postLostItem', res.data);
    } else if (itemType === 'found') {
      res.render('postFoundItem', res.data);
    }
  },
  'userPage': function (req, res, next) {
    if (req.data.mark !== 'user data') {
      next(new Error('Wrong request data mark: ' + req.data.mark));
    }

    res.data.title = '个人主页 | 失物招领管理系统';

    AV.Promise.when(api.users.read(req.data), api.users.getLostItems(req.data.id), api.users.getFoundItems(req.data.id))
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
            'location': item.get('location'),
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
            'location': item.get('location'),
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
    if (req.data.mark !== 'item data') {
      next(new Error('Wrong request data mark: ' + req.data.mark));
    }

    res.data.title = '物品信息 | 失物招领管理系统'

    api.items.read(req.data, true)
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
          'location': item.get('location').latitude + ',' + item.get('location').longitude,
          'time': item.createdAt.toLocaleString(),
          'type': item.get('type'),
          'itemDescription': item.get('itemDescription'),
          'imageURL': item.get('image').url()
        };

        // TODO: 之后改成浏览器端ajax加载
        item.getComments()
          .then(function (comments) {
            res.data.comments = [];
            for (var i = 0; i < comments.length; i++) {
              var comment = comments[i];
              var formatComment = {
                'author': {
                  'id': comment.get('author').id,
                  'name': comment.get('author').get('name')
                },
                'time': comment.createdAt.toLocaleString(),
                'content': comment.get('content')
              }
              if (comment.get('replyTo')) {
                formatComment.replyTo = {
                  'id': comment.get('replyTo').id,
                  'name': comment.get('replyTo').get('name')
                };
              };
              res.data.comments.push(formatComment);
            };

            res.render('detail', res.data);
          })
          .catch(function (error) {
            // TODO: handle error
          });
      })
      .catch(function (error) {
        // TODO: handle error
      });
  },
  'mapPage': function (req, res, next) {
    res.data.title = '首页 | 失物招领管理系统'
    res.render('map', res.data);
  }
};

module.exports = frontendControllers;
