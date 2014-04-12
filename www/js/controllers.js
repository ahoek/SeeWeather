angular.module('starter.controllers', [])

	.controller('LocationsController', function($scope, Locations) {
		$scope.locations = Locations.all();
	})

	.controller('LocationController', function($scope, $stateParams, Locations) {
		$scope.location = Locations.get($stateParams.locationId);

		var makeGroups = function(weatherList) {
			var forecastDays = {};
			var forecastsLength = weatherList.length;
			var day;

			for (var i = 0; i < forecastsLength; i++) {
				day = new Date(weatherList[i].dt * 1000).toISOString().replace(/T.+/, '');

				if (!forecastDays[day])
					forecastDays[day] = [];

				forecastDays[day].push(weatherList[i]);
			}
			return forecastDays;
		};

		
		Locations.getWeather($scope.location.name).then(function(weather) {
			//$scope.weather = weather.list;
			$scope.forecastDays = makeGroups(weather.list);


		});

		$scope.refreshWeather = function() {
			Locations.getWeather($scope.location.name).then(function(weather) {
				$scope.forecastDays = makeGroups(weather.list);

				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	})

	// Side menu toggle button
	.controller('ContentController', function($scope, $ionicSideMenuDelegate) {
		$scope.toggleRight = function() {
			$ionicSideMenuDelegate.toggleRight();
		};
	})

