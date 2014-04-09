angular.module('starter.services', [])

	/**
	 * Location service
	 */
	.factory('Locations', function($q, $http) {
		// Location placeholder, @todo get from local storage
		var locations = [
			{id: 0, name: 'Wassenaar, nl' },
			{id: 1, name: 'Den Haag, nl' },
			{id: 2, name: 'Voorschoten, nl' },
			{id: 3, name: 'Rotterdam, nl' }
		];

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
				var openWeatherUrl = "http://api.openweathermap.org/data/2.5/weather";

				$http({
					method: 'GET', 
					url: openWeatherUrl, 
					params: {
						APPID: "***REMOVED***",
						q: name						
					}}).
					success(function(data, status, headers, config) {
					  deferred.resolve(data);
					}).
					error(function(data, status, headers, config) {
						console.log('jammer maar helaas');
					});
		
                return deferred.promise;
				
			}
		}
	});
