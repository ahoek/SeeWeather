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

/**
 * Location forecast detail controller
 */ 
controllers.controller('LocationController', function ($scope, Locations, OpenWeatherMap, $cordovaDeviceOrientation, localStorageService) {
    $scope.spinner = false;

    // @todo settings helper/service
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
            });
        //watch.clearWatch();
    }, false);
});