(function(d, nav){

  Vue.config.debug = true;

  var geocoder = new google.maps.Geocoder();

  var shopList = new Vue({
    el: '#nearestShop',
    data: {
      shops: [],
      orderedShops: [],
      nearestShop: {},
      currentPosition: {
        latitude: "",
        longitude: ""
      }
    },
    created: function() {
      this.fetchData();
    },
    watch: {
      shops: 'getDistance'
    },
    methods: {
      getDistance: function() {
        var self = this;
        var orderedShopsList = [];

        for (var i = self.shops.length - 1; i >= 0; i--) {
          orderedShopsList.unshift({
            latitude: self.shops[i].geo.latitude,
            longitude: self.shops[i].geo.longitude
          });
        }

        nav.geolocation.getCurrentPosition( function(position) {

          var nearestShop = geolib.findNearest(
            { latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            orderedShopsList
          );

          self.nearestShop = self.shops[parseInt(nearestShop.key)];

          self.orderedShops.push(self.shops[parseInt(nearestShop.key)]);

          for (var i = nearestShop.length - 1; i >= 0; i--) {
            self.orderedShops.push(self.shops[parseInt(nearestShop.key)]);
          }
        });
      },
      fetchData: function() {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open('GET', 'shop2.json');
        xhr.onload = function () {
          self.shops = JSON.parse(xhr.responseText);
        }
        xhr.send();
      }
    }
  });

})(document, navigator);