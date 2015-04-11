// SeeWeather App
angular.module('SeeWeather', ['ionic', 'ngCordova', 'SeeWeather.controllers', 'SeeWeather.services', 'SeeWeather.filters'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppController'
            })

            .state('app.location', {
                url: '/location',
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
        $urlRouterProvider.otherwise('app/location');

    });

