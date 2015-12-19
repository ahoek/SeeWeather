/**
 * OpenWeatherMap service
 */
const openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5"
const appId = OPENWEATHERMAP_APPID

class OpenWeathermapClient {
    constructor($q, $http) {
        this.$q = $q
        this.$http = $http
    }

    // Find cities near geo coordinates
    findCitiesNearCoords(coords) {
        var deferred = this.$q.defer()
        var url = openWeatherBaseUrl + "/find"
        var params = {
            APPID: appId,
            lat: coords.latitude.toFixed(6),
            lon: coords.longitude.toFixed(6),
            cnt: 6,
            type: 'like',
            mode: "json"
        }

        this.$http({ method: "GET", url: url, params: params })
            .success(data => {
                if (data.count > 0) {
                    var locations = data.list
                    deferred.resolve(locations)
                } else {
                    deferred.reject('Error finding city with given coordinates')
                }
            })
            .error(() => { deferred.reject('Error finding city') })

        return deferred.promise
    }

    // Find cities with name
    findCitiesWithName(name) {
        var deferred = this.$q.defer()
        var url = openWeatherBaseUrl + "/find"
        var params = {
            APPID: appId,
            q: name,
            cnt: 6,
            type: 'like',
            mode: "json"
        }

        // @todo allow cancelling
        this.$http({ method: "GET", url: url, params: params })
            .success((data, status) => {
                console.log(data, status)
                if (data.count > 0) {
                    var locations = data.list
                    deferred.resolve(locations)
                } else {
                    deferred.reject('Error finding city with name')
                }
            })
            .error(() => { deferred.reject('Error finding city') })

        return deferred.promise
    }

    /** 
     * Get the weather forecast by city id or name
     */
    getWeather(location) {
        var deferred = this.$q.defer()
        var url = openWeatherBaseUrl + "/forecast"
        var params = { APPID: appId }
        if (location.id) {
            params.id = location.id
        } else if (location.name) {
            params.q = location.name
        } else {
            deferred.reject('Invalid location object input')
        }
        this.$http({method: 'GET', url: url, params: params})
            .success(data => { deferred.resolve(data) })
            .error(() => { deferred.reject('Error retrieving weather forecast')})
        return deferred.promise
    }
}

app.services.service('OpenWeatherMap', OpenWeathermapClient);
