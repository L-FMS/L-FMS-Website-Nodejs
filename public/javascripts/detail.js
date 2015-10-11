/**
 * 
 * @authors Tom Hu (webmaster@h1994st.com)
 * @date    2014-07-25 16:25:17
 * @version 1.0
 */

$(document).ready(function() {
  $('.item-comment-box textarea').focus(function(event) {
    $(this).animate({
      height: "86px"
    }, 250);
    $('.item-comment-box .comment-btn').fadeIn(100);
  });

  $('#comment-cancel-btn').click(function(event) {
    event.preventDefault();
    $('.item-comment-box textarea').animate({
      height: "42px"
    }, 250);
    $('.item-comment-box textarea').val('');
    $('#comment-reply-target').val('');
    $('.item-comment-box .comment-btn').fadeOut(100);
  });

  $('.item-comment-reply').click(function(event) {
    event.preventDefault();
    $('.item-comment-box textarea').focus();
    var destId = $(this).data('owner');
    if (destId) $('#comment-reply-target').val(destId);
  });

  $('#contact-btn').click(function(event) {
    event.preventDefault();

    var $btn = $(this).button('loading');

    var fromId = $(this).data('sender');
    var toId = $(this).data('receiver');
    var itemId = $(this).data('itemId');

    $.post('/sendMessage/' + toId, {itemId: itemId}, function(data, textStatus, xhr) {
      $btn.button('reset');
      console.log(data);
    });
  });

  // init map
  var map = new BMap.Map('item-map');
  var local = new BMap.LocalSearch(map);

  function initMap(point) {
    map.centerAndZoom(point, 18);

    // 右下角，添加比例尺
    var scaleControl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    map.addControl(scaleControl);

    // 添加导航控件
    var navigationControl = new BMap.NavigationControl({
      // 靠左上角位置
      anchor: BMAP_ANCHOR_TOP_LEFT
    });
    map.addControl(navigationControl);

    // Add overlay
    var type = $('#item-map').data('type');
    var mk;
    if (type === 'found') {
      itemIcon = new BMap.Icon("/images/marker_green_sprite.png", new BMap.Size(19,25));
      mk = new BMap.Marker(itemPoint, { icon:itemIcon });
    } else {
      mk = new BMap.Marker(itemPoint);
    }
    map.addOverlay(mk);
  }

  var pointStr = $('#item-map').data('location');
  var itemLocation = pointStr.split(',');

  if (pointStr.length === 0) {
    var itemAddress = $('#item-map').data('address');
    local.search(itemAddress, {
    onSearchComplete: function () {
      var point = local.getResults().getPoi(0).point;
      initMap(point);
    }
  });
  } else {
    var itemPoint = new BMap.Point(itemLocation[1], itemLocation[0]);
    initMap(itemPoint);
  }
});