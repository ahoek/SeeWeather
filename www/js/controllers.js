angular.module('starter.controllers', [])
	.controller('AppController', function($scope) {
	})

	// Side menu toggle button
	.controller('ContentController', function($scope, $ionicSideMenuDelegate) {

		$scope.toggleRight = function() {
			$ionicSideMenuDelegate.toggleRight();
		};
	})
  
	.controller('MenuController', function($scope, Locations) {
	
		// Helper function to add location
		var createLocation = function(name) {
			var newLocation = Locations.newLocation(name);
			$scope.locations.push(newLocation);
			Locations.save($scope.locations);
		};
		$scope.locations = Locations.all();
		// Called to create a new location
		$scope.newLocation = function() {
			var name = prompt('Voer de plaatsnaam in');
			if (name) {
				createLocation(name);
				//$scope.sideMenuController.close();
			}
		};
	})
	
	// Location overview
	.controller('LocationsController', function($scope, Locations) {
		$scope.locations = Locations.all();
	})

	// Location forecast detail
	.controller('LocationController', function($scope, $stateParams, Locations) {
		$scope.location = Locations.get($stateParams.locationId);

		// Group by day helper function
		var makeGroups = function(weatherList) {
			var forecastDays = {};
			var forecastsLength = weatherList.length;
			var day;

			for (var i = 0; i < forecastsLength; i++) {
				// Convert timestamp to iso date
				day = new Date(weatherList[i].dt * 1000).toISOString().replace(/T.+/, '');

				if (!forecastDays[day]) {
					forecastDays[day] = [];
				}
				forecastDays[day].push(weatherList[i]);
			}
			return forecastDays;
		};

		Locations.getWeather($scope.location.name).then(function(weather) {
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


