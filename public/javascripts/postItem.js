/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-09 20:02:40
 * @version 1.0
 */

$(document).ready(function() {
  // init
  $("select").selectpicker({ style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse' });
  $(".tagsinput").tagsInput();

  // init map
  var map = new BMap.Map('item-map');

  // Default - current city
  var myCity = new BMap.LocalCity();
  myCity.get(function (result) {
    var cityName = result.name;
    map.centerAndZoom(cityName);

    // 右下角，添加比例尺
    var scaleControl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    map.addControl(scaleControl);

    // 添加导航控件
    var navigationControl = new BMap.NavigationControl({
      // 靠左上角位置
      anchor: BMAP_ANCHOR_TOP_LEFT
    });
    map.addControl(navigationControl);
  });

  function markAtLocation(point) {
    // Remove overlays
    map.clearOverlays();

    // Add new overlay
    var mk = new BMap.Marker(point);
    map.addOverlay(mk);
    map.panTo(point);
  }

  map.addEventListener('click', function(e) {
    var point = e.point;

    // Mark and move to point
    markAtLocation(point);

    // Get address
    getAddressOfPoint(point, {
      success: function (result) {
        $('#post-location').val(result.point.lat + ',' + result.point.lng);
        $('#post-place').val(result.address);
      }
    });
  });

  // Get current location
  $('#location-button').on('click', function(event) {
    event.preventDefault();

    var $btn = $(this).button('loading');
    getCurrentLocation({
      success: function (result) {
        $btn.button('reset');
        $('#post-location').val(result.point.lat + ',' + result.point.lng);
        $('#post-place').val(result.address);

        // Zoom
        map.setZoom(18);

        // Mark and move to point
        markAtLocation(result.point);
      },
      error: function (msg) {
        alert('无法获取当前地址');
        $btn.button('reset');
      }
    });
  });

  var ac = new BMap.Autocomplete({
    'input': 'post-place',
    'location': map
  });

  ac.addEventListener('onconfirm', function(e) {
    var value = e.item.value;
    var address = value.province +  value.city +  value.district +  value.street + value.streetNumber +  value.business;

    var local = new BMap.LocalSearch(map, {
      onSearchComplete: function () {
        var point = local.getResults().getPoi(0).point;

        $('#post-location').val(point.lat + ',' + point.lng);

        map.setZoom(18);
        markAtLocation(point);
      }
    });

    local.search(address);
  });
});
