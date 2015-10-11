/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-09-01 15:45:46
 * @version 1.0
 */
var AV  = require('avoscloud-sdk').AV;
var api = require('../api');
var Item = require('../models/item');

var frontendControllers = {
  'homepage': function (req, res, next) {
    res.data.title = '首页 | 失物招领管理系统';
    // res.render('index', res.data);
    res.render('map', res.data);
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

    res.data.title = '物品信息 | 失物招领管理系统';

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
          'imageURL': item.get('image').url(),
          'tags': item.get('tags').join(', ')
        };

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
    res.data.title = '首页 | 失物招领管理系统';
    res.render('map', res.data);
  },
  'settingsPage': function (req, res, next) {
    res.data.title = '个人设置 | 失物招领管理系统';
    res.render('settings', res.data);
  },
  'notificationCenterPage': function (req, res, next) {
    res.data.title = '消息中心 ｜ 失物招领管理系统';
    // 获取当前用户的所有消息
    api.itemNotifications.all()
      .then(function (results) {
        res.data.results = [];
        for (var i = 0; i < results.length; i++) {
          var itemNotification = results[i];
          var type = itemNotification.get('type');
          var sender = itemNotification.get('from');
          var item = itemNotification.get('item');

          var message = {
            senderId: sender.id,
            senderName: sender.get('name'),
            itemId: item.id
          };

          res.data.results.push({
            status: itemNotification.get('isRead') ? '已读' : '未读',
            message: message,
            type: type
          });

          if (!itemNotification.get('isRead')) {
            itemNotification.set('isRead', true);
            itemNotification.save();
          }
        };

        res.render('notificationCenter', res.data);
      })
      .catch(function (error) {
        // TODO: handle error
        console.log('error');
        console.log(error);
      });
  },
  'register': function (req, res, next) {
    var object = req.data || null;
    delete object.mark;

    api.users.add(object)
      .then(function (user) {
        res.redirect('/');
      })
      .catch(function (error) {
        // TODO: handle error
        res.redirect('/');
      });
  },
  'addComment': function (req, res, next) {
    var object = req.data || null;
    delete object.mark;

    api.comments.add(object)
      .then(function (comment) {
        // 添加一条未读消息
        var data = {};

        data.to = object.destId || object.itemOwner;
        data.type = 'comment';
        data.itemId = object.item.id;

        api.itemNotifications.add(data)
          .then(function (itemNotification) {
            console.log('success add comment notification');
          })
          .catch(function (error) {
            // TODO: handle error
            console.log('fail add comment notification');
          });
      })
      .catch(function (error) {
        // TODO: handle error
      });

    res.redirect('back');
  },
  'addItem': function (req, res, next) {
    var object = req.data || null;
    delete object.mark;

    api.items.add(object)
      .then(function (item) {
        res.redirect('/items/' + item.id);
      })
      .catch(function (error) {
        // TODO: handle error
        res.redirect('/');
      });
  },
  'updateUserInfo': function (req, res, next) {
    var object = req.data || null;
    delete object.mark;

    var currentUser = AV.User.current();
    for (var key in object) {
      if (key === 'mobilePhoneNumber') {
        currentUser.setMobilePhoneNumber(object[key]);
        continue;
      };
      currentUser.set(key, object[key]);
    }

    currentUser.save()
      .then(function (user) {
        res.redirect('back');
      })
      .catch(function (error) {
        // TODO: handle error
        res.redirect('back');
      });
  },
  'changePassword': function (req, res, next) {
    var currentUser = AV.User.current();
    var oldPassword = req.body['old-pwd'];
    var newPassword = req.body['new-pwd'];
    var confirmPassword = req.body['confirm-pwd'];

    if (newPassword !== confirmPassword) {
      res.redirect('back');
      return;
    };

    currentUser.updatePassword(oldPassword, newPassword)
      .then(function (user) {
        res.redirect('back');
      })
      .catch(function (user, error) {
        // TODO: handle error
        res.redirect('back');
      });
  },
  'sendMessage': function (req, res, next) {
    // 添加一条未读消息
    var object = req.data || {};
    delete object.mark;

    object.to = object.id;
    delete object.id;
    object.type = 'itemConfirm';
    object.itemId = req.body.itemId;

    api.itemNotifications.add(object)
      .then(function (itemNotification) {
        var data = {
          'isSuccess': true
        };
        res.json(data);
      })
      .catch(function (error) {
        // TODO: handle error
        var data = {
          'isSuccess': false
        };
        res.json(data);
      });
  }
};

module.exports = frontendControllers;
