(function(d, nav){

  var shopJSON = JSON.parse(d.getElementById('shopJSON').textContent);
  var shopJSONGeo = [];

  for (var i = shopJSON.length - 1; i >= 0; i--) {
    shopJSONGeo.push({latitude: shopJSON[i].geo.latitude, longitude: shopJSON[i].geo.longitude});
  }

  var app = new Vue({
    el: '#app',
    data: {
      shops: []
    },
    created: function() {
      this.getDistanceList()
    },
    watch: {
      shops: 'getDistanceList'
    },
    methods: {
      getDistanceList: function() {
        var self = this;
        nav.geolocation.getCurrentPosition( function(position) {
          var distanceList = geolib.orderByDistance(
            { latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            shopJSONGeo
          );

          var orderedShopList = [];
          for (var i = distanceList.length - 1; i >= 0; i--) {
            orderedShopList.push(shopJSON[distanceList[i].key]);
          }
        self.shops = orderedShopList;
        });
      }
    }
  });

  app.shops = getDistanceList();

  function getDistanceList() {
    var self = this;

    nav.geolocation.getCurrentPosition( function(position) {
      var distanceList = geolib.orderByDistance(
        { latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        shopJSONGeo
      );

      var orderedShopList = [];

      for (var i = distanceList.length - 1; i >= 0; i--) {
        orderedShopList.push(shopJSON[distanceList[i].key]);
      }

      self.shops = orderedShopList;
    });
  }
})(document, navigator);