/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-03 22:23:28
 * @version 1.0
 */
$(document).ready(function() {
  function retrieveItems(centerPoint) {
    var point = new AV.GeoPoint({
      'latitude': centerPoint.lat,
      'longitude': centerPoint.lng
    });

    var query = new AV.Query(Item);
    debugger;
    query.near('location', point);
    query.find({
      success: function (items) {
        console.log(items);
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

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

      retrieveItems(point);
    });
    geolocationControl.addEventListener('locationError', function (e) {
      // 定位失败事件
      console.log(e.message);
    });
    map.addControl(geolocationControl);

    geolocationControl.location();
  });
});
