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
	/*
	.controller('NavBarController', function($scope, $ionicNavBarDelegate) {
		$scope.getPreviousTitle = function() {
			console.log($ionicNavBarDelegate);
			return $ionicNavBarDelegate.getPreviousTitle();
		};
	})
*/
/*
 * // Current weather
 .controller('LocationController', function($scope, $stateParams, Locations) {
 $scope.location = Locations.get($stateParams.locationId);
 Locations.getWeather($scope.location.name).then(function(weather) {
 $scope.weather = weather;
 });
 $scope.refreshWeather = function() {
 Locations.getWeather($scope.location.name).then(function(weather) {
 $scope.weather = weather;
 
 var now = new Date();
 $scope.lastRefresh = "Laatste update: " + now.toTimeString();
 //Stop the ion-refresher from spinning
 $scope.$broadcast('scroll.refreshComplete');
 });
 };
 })
 */
