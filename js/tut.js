var app = angular.module('myWeather', ['google-maps']);




// had to change the global variables
// from 
	// config = {
 //      map: new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
 //      geocoder: new google.maps.Geocoder(),
 //      marker: 0
 //    };
 config: {
            geocoder: new google.maps.Geocoder(),
            infowindow : new google.maps.InfoWindow
          
        } 





        // inside my mapctrl
        // from
        // config.marker = new google.maps.Marker({
        //         map: myWeatherApp.config.map,
        //         animation: google.maps.Animation.DROP,
        //         position: pos
        //     });
		// to: 

        google.maps.visualRefresh = true;
        // map
        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 8,
            // marker
            markers: [{
                id: 1,
                latitude: 45,
                longitude: -73,
                showWindow: true,
                title: "haha"

            }],
            // click event
            events: {
                click: function (mapModel, eventName, originalEventArgs) {
                  // 'this' is the directive's scope
                  console.log("click map event fired!");
                  var e = originalEventArgs[0];
                  $scope.placeMarker(e.latLng);

                  //scope apply required because this event handler is outside of the angular domain
                  // $scope.$apply();
                }
            }




// inside my geolocation
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

