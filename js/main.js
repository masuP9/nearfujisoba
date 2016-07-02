var NfShop = Vue.extend({
  template: "#nf-shop",
  props: ["shop"]
});

var NfGoogleMap = Vue.extend({
  template: "#nf-googleMap",
  props: ["locationName", "geo", "zoom"],
  computed: {
    src : function(){
      return 'https://www.google.com/maps/embed/v1/place?key=AIzaSyB8JV1UkMaiLnlnIWoNsJDVMP7gic4YyTI&q=富士そば+' + this.locationName+ '&center=' + this.geo.latitude + ',' + this.geo.longitude + '&zoom=' + this.zoom;
    }
  }
});

Vue.component('nf-shop', NfShop);
Vue.component('nf-googleMap', NfGoogleMap);

(function(d, nav){

  Vue.config.debug = true;

  var geocoder = new google.maps.Geocoder();

  var app = new Vue({
    el: '#app',
    data: {
      shops: [],
      orderedShops: [],
      nearestShop: {},
      currentPosition: {}
    },
    created: function() {
      if(!navigator.geolocation) { // navigator.geolocation が使える端末かどうか
        this.currentPosition = {
          code: 4
        }
        return false;
      }
      this.fetchData(); // データを取得
    },
    watch: {
      shops: 'getNearestShop'
    },
    methods: {
      getNearestShop: function() {
        var self = this;
        var ShopsList = [];

        for (var i = self.shops.length - 1; i >= 0; i--) {
          ShopsList.unshift({
            latitude: self.shops[i].geo.latitude,
            longitude: self.shops[i].geo.longitude
          });
        }

        nav.geolocation.getCurrentPosition(function(position) {

          self.currentPosition = position;

          var nearestShop = geolib.findNearest(
            { latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            ShopsList
          );

          self.nearestShop = self.shops[parseInt(nearestShop.key)];

        }, function(err){
          self.currentPosition = err;
          console.warn('Error(' + err.code + '):' + err.message);
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