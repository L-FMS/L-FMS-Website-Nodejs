/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-03 22:23:28
 * @version 1.0
 */
$('#myModal').modal({
  keyboard: false
});

$('#myModal').on('show.bs.modal', function (e) {
  $('#loading-progress').width('0%');
})

$('#myModal').on('hidden.bs.modal', function (e) {
  $('#loading-progress').width('0%');
})

$(document).ready(function() {
  $('#loading-progress').width('5%');
  // init map
  var map = new BMap.Map('item-map');
  var itemOverlays = [];
  var mgr = new BMapLib.MarkerManager(map, { maxZoom: 18, trackMarkers: true });
  var centerMarkerManager = new BMapLib.MarkerManager(map, { maxZoom: 18 });

  function getResultItem(item) {
    var type = item.get('type');
    var typeStr = '';

    if (type === 'found') {
      typeStr = '捡到的物品'
    } else {
      typeStr = '丢失的物品'
    }

    var html = '<div class="col-sm-12 result-item">' +
                 '<div class="row">' +
                   '<div class="col-sm-8">' +
                     '<div class="result-item-name">' +
                       '<a href="/items/' + item.id + '">' + item.get('name') + ' <span class="result-item-type">(' + typeStr + ')</span></a>' +
                     '</div>' +
                     '<div class="result-item-info">' +
                       '<p><small class="result-item-place">地点：<span>' + item.get('place') + '</span></small><br/>' +
                       '<small class="result-item-description">物品描述：<span>' + item.get('itemDescription') + '</span></small><br/>' +
                       '<small class="result-item-tags">标签：<span>' + item.get('tags').join(', ') + '</span></small></p>' +
                     '</div>' +
                   '</div>' +
                   '<div class="col-sm-4">' +
                     '<img class="result-item-image" src="' + item.get('image').url() + '" alt="test">' +
                   '</div>' +
                 '</div>' +
               '</div>';
    return $(html)
  }

  function getEmptyResultItem() {
    var html = '<div class="col-sm-12 result-item disabled">' +
                 '<div class="row">' +
                   '<div class="col-sm-12">' +
                     '<p class="text-center text-muted">附近没有物品</p>' +
                   '</div>' +
                 '</div>' +
               '</div>';
    return $(html);
  }

  function addItem(item) {
    var itemGeoPoint = item.get('location');
    var address = item.get('place');
    var type = item.get('type');
    var typeStr = '';
    var itemIcon;
    var mk;

    var itemPoint = new BMap.Point(itemGeoPoint.longitude, itemGeoPoint.latitude); // lng, lat

    if (type === 'found') {
      typeStr = '捡到的物品'
      itemIcon = new BMap.Icon("/images/marker_green_sprite.png", new BMap.Size(19,25));
      mk = new BMap.Marker(itemPoint, { icon:itemIcon });
    } else {
      typeStr = '丢失的物品'
      mk = new BMap.Marker(itemPoint);
    }

    // Add new overlay
    mgr.addMarker(mk);

    // Add info window
    // 百度地图API功能
    var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
                    '<img src="' + item.get('image').url() + '" alt="' + item.get('name') + '" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
                    '地址：' + item.get('place') + '<br/>简介：' + item.get('itemDescription') + '<br/><a href="/items/' + item.id + '">详细信息</a>' +
                  '</div>';
    var itemInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
      title: item.get('name') + '(' + typeStr + ')',
      width: 290,
      // height: 105,
      panel: 'panel',
      enableAutoPan: true,
      enableCloseOnClick: true,
      searchTypes: []
    });
    mk.addEventListener('click', function () {
      itemInfoWindow.open(mk);
    });

    // Add to result list
    var list = $('#result-list>.row.list');
    var resultItem = getResultItem(item);
    resultItem.on('click', function(event) {
      // event.preventDefault();
      itemInfoWindow.open(mk);
      map.panTo(itemPoint);
    });
    list.append(resultItem);
  }

  function showItems(items, notPanToCenter) {
    $('#loading-progress').width('60%');
    mgr.clearMarkers();
    var list = $('#result-list>.row.list');
    list.empty();

    if (items.length === 0) {
      list.append(getEmptyResultItem());
    };

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      addItem(item);
      if (!notPanToCenter && i == 0) {
        var itemGeoPoint = item.get('location');
        var itemPoint = new BMap.Point(itemGeoPoint.longitude, itemGeoPoint.latitude); // lng, lat
        map.panTo(itemPoint);
      };
    };

    mgr.showMarkers();
    $('#loading-progress').width('80%');
  }

  function retrieveItems(centerPoint, notPanToCenter) {
    // center point是百度地图的点
    $('#loading-progress').width('40%');
    var point = new AV.GeoPoint({
      'latitude': centerPoint.lat,
      'longitude': centerPoint.lng
    });

    var query = new AV.Query(Item);
    query.withinKilometers('location', point, 2.5);
    // query.near('location', point);
    query.find({
      success: function (items) {
        showItems(items, notPanToCenter);
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  function searchItems(keywords) {
    var nameQuery = new AV.Query(Item);
    nameQuery.contains('name', keywords);

    var tagQuery = new AV.Query(Item);
    tagQuery.equalTo('tags', keywords);

    var descriptionQuery = new AV.Query(Item);
    descriptionQuery.contains('itemDescription', keywords);

    var placeQuery = new AV.Query(Item);
    placeQuery.contains('place', keywords);

    var mainQuery = new AV.Query.or(nameQuery, tagQuery, descriptionQuery, placeQuery);

    mainQuery.find({
      success: function (items) {
        showItems(items);
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  $('#loading-progress').width('10%');
  // Default - current city
  var myCity = new BMap.LocalCity();
  myCity.get(function (result) {
    var cityName = result.name;
    map.centerAndZoom(cityName);
  });

  // 右下角，添加比例尺
  var scaleControl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
  map.addControl(scaleControl);

  // 添加导航控件
  var navigationControl = new BMap.NavigationControl({
    // 靠左上角位置
    anchor: BMAP_ANCHOR_TOP_LEFT
  });
  map.addControl(navigationControl);

  // 添加定位控件
  var geolocationControl = new BMap.GeolocationControl({
    enableAutoLocation: true
  });

  geolocationControl.addEventListener('locationSuccess', function (e) {
    // 定位成功事件
    var address = '';
    address += e.addressComponent.province;
    address += e.addressComponent.city;
    address += e.addressComponent.district;
    address += e.addressComponent.street;
    address += e.addressComponent.streetNumber;

    var point = e.point;

    map.centerAndZoom(point, 18);

    // http://api0.map.bdimg.com/images/geolocation-control/point/position-icon-14x14.png
    var centerIcon = new BMap.Icon("http://api0.map.bdimg.com/images/geolocation-control/point/position-icon-14x14.png", new BMap.Size(14,14));
    var centerMarker = new BMap.Marker(point, { icon:centerIcon });

    map.addOverlay(centerMarker);

    retrieveItems(point);

    $('#loading-progress').width('100%');
    $('#myModal').modal('hide');
  });

  geolocationControl.addEventListener('locationError', function (e) {
    // 定位失败事件
    console.log(e.message);

    $('#loading-progress').width('100%');
    $('#myModal').modal('hide');

    // // Default - current city
    // var myCity = new BMap.LocalCity();
    // myCity.get(function (result) {
    //   var cityName = result.name;
    //   map.centerAndZoom(cityName);
    // });
  });

  map.addControl(geolocationControl);

  $('#loading-progress').width('30%');
  // 开始定位
  geolocationControl.location();

  map.addEventListener('click', function(e) {
    var point = e.point;

    // Mark and move to point
    centerMarkerManager.clearMarkers();

    var itemIcon = new BMap.Icon("/images/marker_gray_sprite.png", new BMap.Size(19,25));
    var mk = new BMap.Marker(point, { icon:itemIcon });
    centerMarkerManager.addMarker(mk);

    centerMarkerManager.showMarkers();

    // Search items around
    retrieveItems(point, true);

    map.panTo(point);
  });

  $('#map-search-form').submit(function (event) {
    event.preventDefault();

    var keywords = $('#navbarInput-01').val();

    searchItems(keywords);

    return false;
  });
});
