// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters'])

	.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	.config(function($stateProvider, $urlRouterProvider) {

		$stateProvider

			.state('locations', {
				url: '/locations',
				templateUrl: 'templates/locations.html',
				controller: 'LocationsController'
			})
			.state('location', {
				url: '/location/:locationId',
				templateUrl: 'templates/location.html',
				controller: 'LocationController'
			})

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/locations');

	});

