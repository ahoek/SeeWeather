angular.module('starter.services', [])

	/**
	 * A simple example service that returns some data.
	 */
	.factory('Friends', function() {
		// Might use a resource here that returns a JSON array

		// Location placeholder
		var locations = [
			{id: 0, name: 'Wassenaar, nl', weather: {} },
			{id: 1, name: 'Den Haag, nl', weather: {} },
			{id: 2, name: 'Voorschoten, nl', weather: {} }
		];

		return {
			all: function() {
				return locations;
			},
			get: function(locationId) {
				var location = locations[locationId];
				
				// Simple index lookup
				var openWeatherUrl = "http://api.openweathermap.org/data/2.5/weather";
				// @todo make async
				//jQuery.ajaxSetup({async:false});
//				jQuery.get(openWeatherUrl, { 
//					APPID: "***REMOVED***",
//					q: location.name 
//				}, function(weatherData) {
//					location.weather = weatherData;
//					console.log(location);
//				});
//$http({method: 'GET', url: openWeatherUrl}).
//    success(function(data, status, headers, config) {
//      // this callback will be called asynchronously
//      // when the response is available
//	  location.weather = data;
//    }).
//    error(function(data, status, headers, config) {
//      // called asynchronously if an error occurs
//      // or server returns response with an error status.
//    });
console.log(location);
				return location;
			}
		}
	});
