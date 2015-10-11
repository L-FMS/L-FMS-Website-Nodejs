/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-11 10:16:18
 * @version 1.0
 */
$(document).ready(function() {
  var push = window.notification || AV.push({
    appId: 'rx17l6bweypfcjvxj7rt6c6fybalxfqe4991jnm00qhpyhpp',
    appKey: 'x0surp0ssgm5zda9b66rykzcamohkxu0a8ez4iuqyx2d7qju'
  });
  window.notification = push

  // 可以链式调用
  push.open(function() {
    showLog('可以接收推送');
  });

  // 监听推送消息
  push.on('message', function(data) {
    showLog('message');
    showLog(JSON.stringify(data));
  });

  // 监听网络异常
  push.on('reuse', function() {
    showLog('网络中断正在重试');
  });

  var currentUser = AV.User.current();
  if (currentUser) {
    push.subscribe([currentUser.id], function(data) {
      showLog('关注新的频道');
    });
  };

  function showLog(msg) {
    console.log(msg);
  }
});
