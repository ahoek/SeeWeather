/**
 * Location controller
 */
class LocationController {
    constructor($scope, Locations, OpenWeatherMap, $cordovaDeviceOrientation, localStorageService) {
        this.scope = $scope
        this.locations = Locations,
        this.weatherClient = OpenWeatherMap
        this.deviceOrientation = $cordovaDeviceOrientation
        this.localStorage = localStorageService
        
        this.spinner = false

        this.initSettings()

        this.location = this.locations.getActiveLocation()
        this.scope.$watch(
            () => this.locations.activeLocation, 
            this.activeLocationChanged()
        )

        // Get the compass heading
        // fix: only if phone is held horizontally
        this.heading = null
        document.addEventListener("deviceready", () => {
            var options = {
                filter: true
            }
            var watch = this.deviceOrientation.watchHeading(options).then(
                null,
                () => { console.log('Error retrieving device orientation') },
                result => { this.heading = result.magneticHeading }
            )
            //watch.clearWatch()
        }, false)
    }
    
    /**
     * Refresh the weather for the current location
     */
    refreshWeather() {
        this.weatherClient.getWeather(this.location).then(weather => {
            this.forecastDays = this.makeGroups(weather.list)

            // Stop the ion-refresher from spinning
            this.scope.$broadcast('scroll.refreshComplete')
        })
    }
    
    /**
     * Return function to run if active location has changed
     */
    activeLocationChanged() {
        return () => {
            this.location = this.locations.getActiveLocation()
            this.spinner = true
            this.weatherClient.getWeather(this.location).then(weather => {
                this.forecastDays = this.makeGroups(weather.list)
                this.spinner = false
            })
        }        
    }
    
    // @todo settings helper/service
    initSettings() {
        this.settings = this.localStorage.get('settings')
        this.scope.$watch(
            () => angular.toJson(this.localStorage.get('settings')), 
            () => { this.settings = this.localStorage.get('settings') }
        )        
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