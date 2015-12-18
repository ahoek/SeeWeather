// SeeWeather App
angular.module('SeeWeather', [
    'ionic',
    'LocalStorageModule',
    'ngCordova',
    'SeeWeather.controllers',
    'SeeWeather.services',
    'SeeWeather.filters'
])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            console.log(navigator.language);
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

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
                    },
                    'menuRight': {
                        templateUrl: 'templates/settings.html',
                        controller: 'SettingsController'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('app/location');

        localStorageServiceProvider
            .setPrefix('SeeWeather')
            .setNotify(true, true);
    });

var controllers = angular.module('SeeWeather.controllers', []);
var services = angular.module('SeeWeather.services', []);
var app = {
    controllers: controllers,
    services: services
};