angular.module('starter.controllers', [])

	.controller('LocationsController', function($scope, Locations) {
		$scope.locations = Locations.all();
	})
	
	.controller('LocationController', function($scope, $stateParams, Locations) {
		$scope.location = Locations.get($stateParams.locationId);
		Locations.getWeather($scope.location.name).then(function(weather) {
			$scope.weather = weather.list;
		});
		$scope.refreshWeather = function() {
			Locations.getWeather($scope.location.name).then(function(weather) {
				$scope.weather = weather.list;

				var now = new Date();
				$scope.lastRefresh = "Laatste update: " + now.toTimeString();
				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	})
	.controller('ContentController', function($scope, $ionicSideMenuDelegate) {
		$scope.toggleRight = function() {
			$ionicSideMenuDelegate.toggleRight();
		};
	})

