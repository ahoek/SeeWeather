// SeeWeather App
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters'])

	.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			ionic.Platform.fullScreen()
			
			if (window.StatusBar) {
				StatusBar.hide();
			}
		});
	})

	.config(function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('app', {
			  url: "/app",
			  abstract: true,
			  templateUrl: "templates/menu.html",
			  controller: 'AppController'
			})

      .state('app.location', {
				url: '/location/:locationId',
        views: {
          'menuContent': {
            templateUrl: 'templates/location.html',
            controller: 'LocationController'
          },
          'menuLeft': {
            templateUrl: 'templates/locations.html',
            controller: 'LocationsController'
          }
        }
			})

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('app/location/0');

	});

