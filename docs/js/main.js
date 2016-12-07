var NfShop = Vue.extend({
  template: "#nf-shop",
  props: ["shop", "currentPlace"]
});

var NfGoogleMap = Vue.extend({
  template: "#nf-googleMap",
  props: ["locationName", "geo", "zoom", "placeid"],
  computed: {
    src: function() {
      return 'https://www.google.com/maps/embed/v1/place?key=AIzaSyB8JV1UkMaiLnlnIWoNsJDVMP7gic4YyTI&q=富士そば+' + this.locationName + '&center=' + this.geo.latitude + ',' + this.geo.longitude + '&zoom=' + this.zoom;
    },
    srcDirection: function() {
      return 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyB8JV1UkMaiLnlnIWoNsJDVMP7gic4YyTI&origin=place_id:' + this.placeid + '&destination=富士そば' + this.locationName + '&mode=transit';
    }
  }
});

Vue.component('nf-shop', NfShop);
Vue.component('nf-googleMap', NfGoogleMap);

(function(d, nav) {

  Vue.config.debug = true;

  var app = new Vue({
    el: '#app',
    data: {
      shops: [],
      orderedShops: [],
      nearestShop: {},
      currentPosition: {},
      currentPlace: {}
    },
    created: function() {
      if (!nav.geolocation) { // navigator.geolocation が使える端末かどうか
        this.currentPosition = {
          code: 4
        }
        return false;
      } else {
        this.getCurrentPosition(); // 現在地を取得
      }
      this.fetchData(); // データを取得
    },
    watch: {
      shops: 'getNearestShop',
      currentPosition: function(){  // JSONデータが更新されたら一番近い店を取得
        this.getcurrentPOsitionPlaceId();
        this.getNearestShop();
      }
    },
    methods: {
      getcurrentPOsitionPlaceId: function() {
        var geocoder = new google.maps.Geocoder;
        var self = this;

        var latlng = {
          lat: self.currentPosition.coords.latitude,
          lng: self.currentPosition.coords.longitude
        };

        geocoder.geocode({ 'location': latlng }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              self.currentPlace = results[0];
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      },
      getCurrentPosition: function() {
        var self = this;

        nav.geolocation.getCurrentPosition(
          function(position) {
            self.currentPosition = position;
          },
          function(err) {
            self.currentPosition = err;
            console.warn('Error(' + err.code + '):' + err.message);
          }
        );
      },
      getNearestShop: function() {
        var self = this;

        if (self.shops.length < 1 || !self.currentPosition.coords) {
          return false;
        }

        var ShopsList = [];
        var orderedShops = [];

        for (var i = self.shops.length - 1; i >= 0; i--) {
          ShopsList.unshift({
            latitude: self.shops[i].geo.latitude,
            longitude: self.shops[i].geo.longitude
          });
        }

        var nearestShopList = geolib.orderByDistance({
            latitude: self.currentPosition.coords.latitude,
            longitude: self.currentPosition.coords.longitude
          },
          ShopsList
        );

        for (var i = nearestShopList.length - 1; i >= 0; i--) {
          orderedShops.unshift(self.shops[nearestShopList[i].key]);
        }

        self.orderedShops = orderedShops;

        self.nearestShop = orderedShops[0];

      },
      fetchData: function() {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open('GET', 'shop.json');
        xhr.onload = function() {
          self.shops = JSON.parse(xhr.responseText);
        }
        xhr.send();
      }
    }
  });

})(document, navigator);
