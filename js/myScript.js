(function(){
    var app = angular.module('myWeather', ['google-maps']);

    app.service('weatherService', function($http, $rootScope) {
        return { 
            getWeather: function(weatherLocation) {
                $rootScope.serviceWeather = { temp: {}, clouds: null };
                $.simpleWeather({
                    location: weatherLocation,
                    unit: 'f',
                    woeid: 'woeid',
                    success: function(weather) {
                        $rootScope.serviceWeather.temp = weather.alt.temp;
                        $rootScope.serviceWeather.city = weather.city;
                        $rootScope.serviceWeather.country = weather.country;
                        $rootScope.serviceWeather.icon = weather.code;
                        $rootScope.serviceWeather.currently = weather.currently;
                        $rootScope.serviceWeather.alttemp = weather.temp;
                        $rootScope.serviceWeather.tempunit  = weather.units.temp;

                        if($rootScope.serviceWeather.temp.current === 17){
                          $("#weather").css("background-color","lightblue");
                        }
                        else if($rootScope.serviceWeather.temp.current > 23){
                          $("#weather").css("background-color","lightblue");
                        }
                        else if($rootScope.serviceWeather.temp.current < 23 ){
                          $("#weather").css("background-color","yellow");
                        }

                        $rootScope.$apply(function(){
                        });
                    
                    }
                });
            
            },

            config: {
                geocoder: new google.maps.Geocoder(),
                infowindow : new google.maps.InfoWindow
              
            } 
        }
    });

    app.controller("mapController", ["$scope", "weatherService", function($scope, weatherService) {

        // google.maps.visualRefresh = true;
        $scope.loading = true;
        $scope.map = 
        {
            center: 
            {
                latitude: 45,
                longitude: -73
            },
            
            zoom: 8,
            markers: 
            [{
                id: 1,
                latitude: 45,
                longitude: -73,
                showWindow: true,
                title: "haha"

            }],
           
            events:
            {
                click: function (mapModel, eventName, originalEventArgs) {
                  // 'this' is the directive's scope
                  console.log("click map event fired!");
                  var e = originalEventArgs[0];
                  $scope.placeMarker(e.latLng);

                  //scope apply required because this event handler is outside of the angular domain
                  // $scope.$apply();
                }
            }
        };

        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(position) 
            {
                var pos = new google.maps.LatLng(position.coords.latitude,
                                           position.coords.longitude);
                // $scope.map.center = pos;
                weatherService.getWeather(position.coords.latitude+','+position.coords.longitude);
                // for the preloader
                
                $scope.$apply(function(){
                    $scope.loading = !$scope.loading;
                });
               
                $scope.map.markers  = [
                                        {
                                          id: 1,
                                          latitude: position.coords.latitude,
                                          longitude: position.coords.longitude,
                                          showWindow: true,
                                          title: 'Marker 2'
                                        }];
                
                $scope.map.center = {
                    
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                $scope.$apply();

            },function() {
                handleNoGeolocation(true);
            });

        } 
        else 
        {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
      

        function handleNoGeolocation(errorFlag) {
            if (errorFlag) 
            {
                var content = 'Error: The Geolocation service failed.';
            } 
            else 
            {
                var content = 'Error: Your browser doesn\'t support geolocation.';
            }

            weatherService.options = {
                map: $scope.map,
                position: new google.maps.LatLng(60, 105),
                content: content
            };

            var infowindow = new google.maps.InfoWindow(options);
            $scope.map.setCenter(options.position);
        } 


        function codeLocation(results, status){
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("success");
                console.log(results[0].geometry.location);
                
                var loc = results[0].geometry.location;
                $scope.map.center = {latitude: loc.lat(), longitude: loc.lng()};
                $scope.map.markers[0] = {latitude: loc.lat(), longitude: loc.lng(), id: 1, title: "marker", showWindow: true};
                $scope.$apply();
            } 
            else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        }
     

        $scope.placeMarker = function(loc) {
            $scope.map.center = {latitude: loc.lat(), longitude: loc.lng()};
            $scope.map.markers[0] = {latitude: loc.lat(), longitude: loc.lng(), id: 1, title: "marker", showWindow: true};
            weatherService.getWeather(loc.lat() + ',' + loc.lng());
        }

        $scope.clickMap = function(latLng){
            placeMarker(latLng);
        }
        
        this.submit = function() {
            if ($scope.address) {
                weatherService.getWeather($scope.address);
                weatherService.config.geocoder.geocode({ 'address': $scope.address}, codeLocation);
                $scope.address = "";

            }
                
        }

    }]);
    
  

})();
