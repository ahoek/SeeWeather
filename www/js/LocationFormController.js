// Add location form
controllers.controller('LocationFormController', function ($scope, $cordovaGeolocation, OpenWeatherMap) {
    
    /**
     * List cities near the GPS location
     */
    $scope.getNearbyCities = function () {
        // Get the geo position from the device
        $scope.spinner = true;
        $cordovaGeolocation.getCurrentPosition().then(function (position) {
            // Get the location from openweathermap
            OpenWeatherMap.findCitiesNearCoords(position.coords).then(function (cities) {
                $scope.cities = cities;
                $scope.spinner = false;
            });
        });
    };

    /**
     * List cities by search query on name
     * @param string name
     */
    $scope.getCitiesByName = function (name) {
        $scope.spinner = true;
        // Get the location from openweathermap
        OpenWeatherMap.findCitiesWithName(name).then(function (cities) {
            $scope.cities = cities;
            $scope.spinner = false;
        });
    };
});