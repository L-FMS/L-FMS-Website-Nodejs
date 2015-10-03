/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-03 22:23:28
 * @version 1.0
 */
$(document).ready(function() {
  var map = new BMap.Map('item-map');

  // 获取当前位置并移至中央
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function (result) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      map.centerAndZoom(result.point, 15);
      var mk = new BMap.Marker(result.point);
      map.addOverlay(mk);
      map.panTo(result.point);
      alert('您的位置：'+result.point.lng+','+result.point.lat);
    } else {
      alert('failed'+this.getStatus());
    }
  }, { enableHighAccuracy: true });
});
