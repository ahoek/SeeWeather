// Add location form
app.controllers.controller('LocationFormController', function ($scope, $cordovaGeolocation, OpenWeatherMap) {
    /**
     * List cities near the GPS location
     */
    $scope.getNearbyCities = function () {
        // Get the geo position from the device
        $scope.spinner = true
        $cordovaGeolocation.getCurrentPosition().then(position => {
            // Get the locations from openweathermap
            OpenWeatherMap.findCitiesNearCoords(position.coords).then(cities => {
                $scope.cities = cities
                $scope.spinner = false
            })
        })
    }

    /**
     * List cities by search query on name
     * 
     * @param string name Search query
     */
    $scope.getCitiesByName = name => {
        $scope.spinner = true
        // Get the locations from openweathermap
        OpenWeatherMap.findCitiesWithName(name).then(cities => {
            $scope.cities = cities
            $scope.spinner = false
        })
    }
})