angular.module('starter.services', [])

	/**
	 * Location service
	 */
	.factory('Locations', function($q, $http) {
		// Location placeholder, @todo get from local storage
		var locations = [
			{id: 0, name: 'Wassenaar, nl'},
			{id: 1, name: 'Den Haag, nl'},
			{id: 2, name: 'Voorschoten, nl'},
			{id: 3, name: 'Rotterdam, nl'},
			{id: 4, name: 'Paris, fr'},
			{id: 5, name: 'New York, us'}
		];
		
		var openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5";

		return {
			all: function() {
				return locations;
			},
			get: function(locationId) {
				var location = locations[locationId];
				return location;
			},
			// Get the current weather
			getWeather: function(name) {
				var deferred = $q.defer();
				//var openWeatherUrl = openWeatherBaseUrl + "/weather";
				//var openWeatherUrl = openWeatherBaseUrl + "/forecast/daily";
				var openWeatherUrl = openWeatherBaseUrl + "/forecast";
				
			
				$http({
					method: 'GET',
					url: openWeatherUrl,
					params: {
						APPID: "***REMOVED***",
						q: name
					}}).
					success(function(data, status, headers, config) {
						console.log(data);
						deferred.resolve(data);
					}).
					error(function(data, status, headers, config) {
						console.log('jammer maar helaas');
					});

				return deferred.promise;

			}
		}
	});
