/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-10-09 23:09:00
 * @version 1.0
 */

function getAddressOfPoint(point, options) {
  var geocoder = new BMap.Geocoder();
  geocoder.getLocation(point, function (result) {
    // Success
    if (options.success) {
      options.success({
        'point': point,
        'address': result.address
      });
    };
  });
}

function getPointOfAddress(address, cityName, options) {
  var geocoder = new BMap.Geocoder();
  geocoder.getPoint(address, function (point) {
    // Success
    if (options.success) {
      options.success({
        'point': point,
        'address': address
      });
    };
  }, cityName);
}

function getCurrentLocation(options) {
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function (result) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      // Get address
      getAddressOfPoint(result.point, options);
    } else {
      // Error handle
      if (options.error) {
        options.error(this.getStatus());
      };
    }
  }, { enableHighAccuracy: true });
}
