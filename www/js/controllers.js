angular.module('starter.controllers', [])
    .controller('AppController', function ($scope, $ionicSideMenuDelegate) {
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
    })

    // Location overview
    .controller('LocationsController', function ($scope, Locations, $ionicModal, $ionicSideMenuDelegate, $state) {

        $scope.locations = Locations.all();
        console.log($scope.locations);

        // Grab the last active, or the first location
        $scope.activeLocation = $scope.locations[Locations.getLastActiveIndex()];

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('templates/new-location.html', function (modal) {
            $scope.locationModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Called when the form is submitted
        $scope.createLocation = function (location) {
            $scope.locations.push({
                name: location.name,
                id: location.id
            });
            Locations.save($scope.locations);
            $scope.locationModal.hide();
            location.name = "";
            location.id = null;
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
            Locations.setLastActiveIndex(location.id);

            // Show the forecast
            $state.go('app.location', { locationId: location.id });

            $ionicSideMenuDelegate.toggleLeft(false);
        };
    })

    // Location forecast detail
    .controller('LocationController', function ($scope, $stateParams, Locations, OpenWeatherMap) {
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

        Locations.get($stateParams.locationId).then(function (location) {
            $scope.location = location;
            if ($scope.location) {
                OpenWeatherMap.getWeather($scope.location).then(function (weather) {
                    $scope.forecastDays = makeGroups(weather.list);
                });
            }
        });

        $scope.refreshWeather = function () {
            OpenWeatherMap.getWeather($scope.location).then(function (weather) {
                $scope.forecastDays = makeGroups(weather.list);

                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
    })

    // Add location form
    .controller('LocationFormController', function ($scope, Geo, OpenWeatherMap) {

        $scope.getNearbyCities = function () {
            // Get the geo position from the device
            Geo.getLocation().then(function (position) {
                console.log(position.coords);
                // Get the location from openweathermap
                OpenWeatherMap.findLocation(position.coords).then(function (cities) {
                    $scope.nearbyCities = cities;

                });
            });
        };

        $scope.setCity = function (city) {
            $scope.city = city;
        };
    });


