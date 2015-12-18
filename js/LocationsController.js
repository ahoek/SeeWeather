// Location overview
app.controllers.controller('LocationsController', function ($scope, $state, Locations, $ionicModal, $ionicSideMenuDelegate, $cordovaGeolocation, OpenWeatherMap, localStorageService) {

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

    $cordovaGeolocation.getCurrentPosition().then(function (position) {
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
});