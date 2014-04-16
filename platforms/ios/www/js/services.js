angular.module('starter.services', [])
	/**
	 * Geolocation
	 * @param {type} $q
	 * @returns {_L5.Anonym$1}
	 */
	.factory('Geo', function($q) {
		return {
			getLocation: function() {
				var q = $q.defer();
				navigator.geolocation.getCurrentPosition(function(position) {
					q.resolve(position);
				}, function(error) {
					q.reject(error);
				});
			}
		}
	})
	/**
	 * Location weather service
	 */
	.factory('Locations', function($q, $http) {
		var openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5";

		return {
			all: function() {
				var locationsString = window.localStorage['locations'];
				if (locationsString) {
					return angular.fromJson(locationsString);
				}
				return [];
			},
			get: function(locationId) {
				var locationsString = window.localStorage['locations'];
				if (locationsString) {
					return angular.fromJson(locationsString)[locationId];
				}

				return {};
			},
			save: function(locations) {
				window.localStorage['locations'] = angular.toJson(locations);
			},
			// Todo verify location and store location identifier
			newLocation: function(name) {
				// Add a new location
				return {
					name: name
				};
			},
			// Get the weather forecast
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
						//console.log(data);
						deferred.resolve(data);
					}).
					error(function(data, status, headers, config) {
						//deferred.
						deferred.reject('jammer maar helaas');
					});

				return deferred.promise;
			}
		};
	});
