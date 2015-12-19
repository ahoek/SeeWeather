/**
 * Location controller
 */
class LocationController {
    constructor($scope, Locations, OpenWeatherMap, $cordovaDeviceOrientation, localStorageService) {

        $scope.spinner = false

        // @todo settings helper/service
        $scope.settings = localStorageService.get('settings')
        $scope.$watch(
            () => angular.toJson(localStorageService.get('settings')), 
            () => { $scope.settings = localStorageService.get('settings') }
        )

        $scope.location = Locations.getActiveLocation()
        $scope.$watch(
            () => Locations.activeLocation, 
            () => {
                $scope.location = Locations.getActiveLocation()
                $scope.spinner = true
                OpenWeatherMap.getWeather($scope.location).then(weather => {
                    $scope.forecastDays = this.makeGroups(weather.list)
                    $scope.spinner = false
                })
            }
        )

        $scope.refreshWeather = () => {
            OpenWeatherMap.getWeather($scope.location).then(weather => {
                $scope.forecastDays = this.makeGroups(weather.list)

                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete')
            })
        }

        // Get the compass heading
        // fix: only if phone is held horizontally
        $scope.heading = null
        document.addEventListener("deviceready", () => {
            var options = {
                filter: true
            }
            var watch = $cordovaDeviceOrientation.watchHeading(options).then(
                null,
                () => { console.log('Error retrieving device orientation') },
                result => { $scope.heading = result.magneticHeading }
            )
            //watch.clearWatch()
        }, false)
    }
    
    // Group by day helper function
    makeGroups(weatherList) {
        var forecastDays = {}
        var forecastsLength = weatherList.length
        var day

        for (var i = 0; i < forecastsLength; i++) {
            // Convert timestamp to iso date
            day = new Date(weatherList[i].dt * 1000).toISOString().replace(/T.+/, '')

            if (!forecastDays[day]) {
                forecastDays[day] = []
            }
            forecastDays[day].push(weatherList[i])
        }
        return forecastDays
    }
}

/**
 * Location forecast detail controller
 */ 
app.controllers.controller('LocationController', LocationController)