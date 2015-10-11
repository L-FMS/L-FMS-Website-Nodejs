/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-10 22:10:10
 * @version 1.0
 */

$(document).ready(function() {
  $("select").selectpicker({ style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse' });

  $('#password>form').submit(function(event) {
    var oldPassword = $('input[name="old-pwd"]').val();
    var newPassword = $('input[name="new-pwd"]').val();
    var confirmPassword = $('input[name="confirm-pwd"]').val();

    if (!oldPassword || !newPassword || !confirmPassword) {
      event.preventDefault();
      alert('不能为空！');
      return false;
    };

    if (newPassword !== confirmPassword) {
      event.preventDefault();
      alert('密码不符！');
      return false;
    };

    return true;
  });

  
});
