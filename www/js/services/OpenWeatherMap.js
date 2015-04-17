/**
 * OpenWeatherMap service
 */
services.factory('OpenWeatherMap', function ($q, $http) {
    var openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5";
    var appId = OPENWEATHERMAP_APPID;

    return {
        // Find cities near geo coordinates
        findCitiesNearCoords: function (coords) {
            var deferred = $q.defer();
            var url = openWeatherBaseUrl + "/find";
            var params = {
                APPID: appId,
                lat: coords.latitude.toFixed(6),
                lon: coords.longitude.toFixed(6),
                cnt: 6,
                type: 'like',
                mode: "json"
            };
            $http({method: "GET", url: url, params: params}).
                success(function (data, status, headers, config) {
                    if (data.count > 0) {
                        var locations = data.list;
                        deferred.resolve(locations);
                    } else {
                        deferred.reject('Error finding city with given coordinates');
                    }
                }).
                error(function (data, status, headers, config) {
                    deferred.reject('Error finding city');
                });

            return deferred.promise;
        },
        // Find cities with name
        findCitiesWithName: function (name) {
            var deferred = $q.defer();
            var url = openWeatherBaseUrl + "/find";
            var params = {
                APPID: appId,
                q: name,
                cnt: 6,
                type: 'like',
                mode: "json"
            };
            // @todo allow cancelling
            $http({method: "GET", url: url, params: params}).
                success(function (data, status, headers, config) {
                    console.log(data, status);
                    if (data.count > 0) {
                        var locations = data.list;
                        deferred.resolve(locations);
                    } else {
                        deferred.reject('Error finding city with name');
                    }
                }).
                error(function (data, status, headers, config) {
                    deferred.reject('Error finding city');
                });
            return deferred.promise;
        },
        /** 
         * Get the weather forecast by city id or name
         */
        getWeather: function (location) {
            var deferred = $q.defer();
            var url = openWeatherBaseUrl + "/forecast";
            var params = {APPID: appId};
            if (location.id) {
                params.id = location.id;
            } else if (location.name) {
                params.q = location.name;
            } else {
                deferred.reject('Invalid location object input');
            }
            $http({method: 'GET', url: url, params: params}).
                success(function (data) {
                    deferred.resolve(data);
                }).
                error(function () {
                    deferred.reject('Error retrieving weather forecast');
                });
            return deferred.promise;
        }
    };
});
