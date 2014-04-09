angular.module('starter.controllers', [])

	.controller('LocationsController', function($scope, Locations) {
		$scope.locations = Locations.all();
	})

	.controller('LocationController', function($scope, $stateParams, Locations) {
		$scope.location = Locations.get($stateParams.locationId);
	        Locations.getWeather($scope.location.name).then(function(weather) {
            $scope.weather = weather;
        });
	})
