angular.module('starter.services', [])
    /**
     * Geolocation
     * 
     * @param {type} $q
     * @returns {_L5.Anonym$1}
     */
    .factory('Geo', function ($q) {
        return {
            getLocation: function () {
                var deferred = $q.defer();
                navigator.geolocation.getCurrentPosition(function (position) {
                    deferred.resolve(position);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    })

    /**
     * Locations and weather services
     */
    .factory('Locations', function ($q) {

        return {
            all: function () {
                var locationsString = window.localStorage['locations'];
                if (locationsString) {
                    return angular.fromJson(locationsString);
                }
                return [];
            },
            get: function (locationId) {
                var deferred = $q.defer();
                var locations = this.all();
                locations.forEach(function (location) {
                    if (location.id === locationId) {
                        deferred.resolve(location);
                    }
                });
                return deferred.promise;
            },
            save: function (locations) {
                window.localStorage['locations'] = angular.toJson(locations);
            },
            // Todo verify location and store location identifier
            newLocation: function (name) {
                // Add a new location
                return {
                    name: name,
                    id: null
                };
            },
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveLocation']) || 0;
            },
            setLastActiveIndex: function (id) {
                window.localStorage['lastActiveLocation'] = id;
            }
        };
    })

    /**
     * OpenWeatherMap service
     */
    .factory('OpenWeatherMap', function ($q, $http) {
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
                $http({ method:"GET", url: url, params: params }).
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
            // Find cities near geo coordinates
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
                $http({ method:"GET", url: url, params: params }).
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
             * Get the weather forecast
             */
            getWeather: function (location) {
                var deferred = $q.defer();
                var url = openWeatherBaseUrl + "/forecast";
                var params = { APPID: appId };
                if (location.id) {
                    params.id = location.id;
                } else if (location.name) {
                    params.q = location.name;
                } else {
                    deferred.reject('Invalid location object input');
                }
                $http({ method: 'GET', url: url, params: params}).
                    success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject('Error retrieving weather forecast');
                    });
                return deferred.promise;
            }
        };
    });
