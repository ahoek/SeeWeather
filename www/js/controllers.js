// Group by day helper function
var makeGroups = function (weatherList) {
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

angular.module('SeeWeather.controllers', [])
    .controller('AppController', function ($scope, $ionicSideMenuDelegate) {
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.showSettings = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
    })

    // Location overview
    .controller('LocationsController', function ($scope, $state, Locations, $ionicModal, $ionicSideMenuDelegate, Geo, OpenWeatherMap, localStorageService) {

        $scope.locations = Locations.all();

        // Grab the last active, or the first location
        $scope.activeLocation = Locations.getActiveLocation();

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('templates/new-location.html', function (modal) {
            $scope.locationModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Create a location from a given city object
        $scope.createLocation = function (city) {
            var location = {
                name: city.name,
                id: city.id
            };
            $scope.locations.push(location);
            Locations.save($scope.locations);

            $scope.selectLocation(location);

            // Clean up the modal
            $scope.locationModal.hide();
            city = null;
        };

        // Open our new location modal
        $scope.newLocation = function () {
            $scope.locationModal.show();
        };

        // Close the new location modal
        $scope.closeNewLocation = function () {
            $scope.locationModal.hide();
        };

        $scope.removeLocation = function (location) {
            var index = $scope.locations.indexOf(location);
            $scope.locations.splice(index, 1);
            Locations.save($scope.locations);
        };

        // Called to select the given location
        $scope.selectLocation = function (location) {
            $scope.activeLocation = location;
            Locations.setActiveLocation(location);

            $ionicSideMenuDelegate.toggleLeft(false);
            // Show the forecast
            $state.go('app.location');
        };

        $scope.settings = localStorageService.get('settings');
        $scope.$watch(function () {
            return angular.toJson(localStorageService.get('settings'));
        }, function () {
            $scope.settings = localStorageService.get('settings');
        });

        Geo.getLocation().then(function (position) {
            // Get the location from openweathermap
            OpenWeatherMap.findCitiesNearCoords(position.coords).then(function (cities) {
                $scope.currentLocation = cities[0];
                if (!$scope.activeLocation) {
                    $scope.selectCurrentLocation();
                }
            });
        });

        $scope.selectCurrentLocation = function () {
            $scope.selectLocation($scope.currentLocation);
        };

        $scope.shouldShowReorder = false;

        $scope.moveLocation = function (location, fromIndex, toIndex) {
            // Move the item in the array
            $scope.locations.splice(fromIndex, 1);
            $scope.locations.splice(toIndex, 0, location);
            Locations.save($scope.locations);
        };
    })

    // Location forecast detail
    .controller('LocationController', function ($scope, Locations, OpenWeatherMap, $cordovaDeviceOrientation, localStorageService) {
        $scope.spinner = false;

        $scope.settings = localStorageService.get('settings');
        $scope.$watch(function () {
            return angular.toJson(localStorageService.get('settings'));
        }, function () {
            $scope.settings = localStorageService.get('settings');
        });

        $scope.location = Locations.getActiveLocation();
        $scope.$watch(function () {
            return Locations.activeLocation
        }, function () {
            $scope.location = Locations.getActiveLocation();
            $scope.spinner = true;
            OpenWeatherMap.getWeather($scope.location).then(function (weather) {
                $scope.forecastDays = makeGroups(weather.list);
                $scope.spinner = false;
            });
        });

        $scope.refreshWeather = function () {
            OpenWeatherMap.getWeather($scope.location).then(function (weather) {
                $scope.forecastDays = makeGroups(weather.list);

                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        // Get the compass heading
        // fix: only if phone is held horizontally
        $scope.heading = null;
        document.addEventListener("deviceready", function () {
            var options = {
                filter: true
            };
            var watch = $cordovaDeviceOrientation.watchHeading(options).then(
                null,
                function (error) {
                    console.log('Error retrieving device orientation');
                },
                function (result) {
                    $scope.heading = result.magneticHeading;
                    //console.log(result.magneticHeading);
                });
            //watch.clearWatch();
        }, false);
    })

    // Add location form
    .controller('LocationFormController', function ($scope, Geo, OpenWeatherMap) {
        $scope.getNearbyCities = function () {
            // Get the geo position from the device
            $scope.spinner = true;
            Geo.getLocation().then(function (position) {
                // Get the location from openweathermap
                OpenWeatherMap.findCitiesNearCoords(position.coords).then(function (cities) {
                    $scope.cities = cities;
                    $scope.spinner = false;
                });
            });
        };

        $scope.getCitiesByName = function (name) {
            // Get the geo position from the device
            $scope.spinner = true;
            Geo.getLocation().then(function (position) {
                // Get the location from openweathermap
                OpenWeatherMap.findCitiesWithName(name).then(function (cities) {
                    $scope.cities = cities;
                    $scope.spinner = false;
                });
            });
        };

        $scope.setCity = function (city) {
            $scope.city = city;
        };
    })
    // Add settings
    // todo: move to settings service
    .controller('SettingsController', function ($scope, localStorageService) {
        if (!localStorageService.get('settings')) {
            localStorageService.set('settings', {
                forecast: {
                    icon: true,
                    temperature: "celcius",
                    windSpeedPrimary: "bft",
                    windSpeedSecundary: "kph",
                    windDirection: true,
                    windDirectionReal: true,
                },
                locations: {
                    showCurrentLocation: true
                }
            });
        }
        localStorageService.bind($scope, 'settings');

        $scope.temperatureOptions = [
            {description: 'Uit', value: false},
            {description: 'Celsius', value: "celsius"},
            {description: 'Fahrenheit', value: "fahrenheit"}
        ];

        $scope.windspeedOptions = [
            {description: 'Uit', value: false},
            {description: 'Bft', value: "bft"},
            {description: 'km/u', value: "kph"},
            {description: 'm/s', value: "mps"}
        ];
    })

    ;


