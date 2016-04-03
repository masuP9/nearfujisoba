(function(d, nav){

  Vue.config.debug = true;

  var geocoder = new google.maps.Geocoder();

  var shopList = new Vue({
    el: '#shopList',
    data: {
      shops: [],
      orderedShops: [],
      currentPosition: {
        latitude: "",
        longitude: ""
      }
    },
    created: function() {
      this.fetchData();
    },
    watch: {
      shops: 'getDistanceList'
    },
    methods: {
      getDistanceList: function() {
        var self = this;
        var orderedShopsList = [];

        for (var i = self.shops.length - 1; i >= 0; i--) {
          orderedShopsList.push({
            latitude: self.shops[i].geo.latitude,
            longitude: self.shops[i].geo.longitude
          });
        }

        nav.geolocation.getCurrentPosition( function(position) {

          var distanceList = geolib.findNearest(
            { latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            orderedShopsList
          );

          self.orderedShops.push(self.shops[parseInt(distanceList.key)]);

          for (var i = distanceList.length - 1; i >= 0; i--) {
            self.orderedShops.push(self.shops[parseInt(distanceList.key)]);
          }
        });
      },
      fetchData: function() {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open('GET', '/shop2.json');
        xhr.onload = function () {
          self.shops = JSON.parse(xhr.responseText);
        }
        xhr.send();
      }
    }
  });

})(document, navigator);