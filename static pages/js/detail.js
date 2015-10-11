/**
 * 
 * @authors Tom Hu (webmaster@h1994st.com)
 * @date    2014-07-25 16:25:17
 * @version 1.0
 */

$(document).ready(function() {
  $('.item-comment textarea').focus(function(event) {
    $('.item-comment .comment-btn').fadeIn(100);
  });

  $('.item-comment textarea').blur(function(event) {
    $('.item-comment .comment-btn').fadeOut(100);
  });

  $('.item-comment textarea').keypress(function(event) {
    if (event.keyCode==13) return false;
  });
});