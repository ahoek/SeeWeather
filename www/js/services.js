angular.module('starter.services', [])
  /**
   * Geolocation
   * 
   * @param {type} $q
   * @returns {_L5.Anonym$1}
   */
  .factory('Geo', function($q) {
    return {
      getLocation: function() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(function(position) {
          deferred.resolve(position);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
    }
  })
  /**
   * Locations and weather services
   */
  .factory('Locations', function($q, $http) {
    var openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5";
    var appId = OPENWEATHERMAP_APPID;

    return {
      all: function() {
        var locationsString = window.localStorage['locations'];
        if (locationsString) {
          return angular.fromJson(locationsString);
        }
        return [];
      },

      get: function(locationId) {
        var locationsString = window.localStorage['locations'];
        if (locationsString) {
          return angular.fromJson(locationsString)[locationId];
        }

        return {};
      },

      save: function(locations) {
        window.localStorage['locations'] = angular.toJson(locations);
      },

      // Todo verify location and store location identifier
      newLocation: function(name) {
        // Add a new location
        return {
          name: name,
          id: null
        };
      },

      getLastActiveIndex: function() {
        return parseInt(window.localStorage['lastActiveLocation']) || 0;
      },

      setLastActiveIndex: function(index) {
        window.localStorage['lastActiveLocation'] = index;
      },      

      // Find a location with geo coordinates
      findLocation: function(coords) {
        var deferred = $q.defer();
        var url = openWeatherBaseUrl + "/find";
        var params = {
          //APPID: appId,
          lat: coords.latitude.toFixed(6),
          lon: coords.longitude.toFixed(6),
          //cnt: 7,
          //type: 'like',
          mode: "json"
        };
        console.log(params);
        $http({
          method: 'GET',
          url: url,
          params: params}).
          success(function(data, status, headers, config) {
            console.log(data, status);
            var location = {};
            if (data.count > 0) {
              var locations = data.list;
              deferred.resolve(locations);
            } else {
              deferred.reject('Error finding city with given coordinates');
            }
          }).
          error(function(data, status, headers, config) {
            console.log(data, status);
            deferred.reject('Error finding city');
          });

        return deferred.promise;
      },

      // Get the weather forecast
      getWeather: function(name) {
        var deferred = $q.defer();
        //var openWeatherUrl = openWeatherBaseUrl + "/weather";
        //var openWeatherUrl = openWeatherBaseUrl + "/forecast/daily";
        var openWeatherUrl = openWeatherBaseUrl + "/forecast";
        $http({
          method: 'GET',
          url: openWeatherUrl,
          params: {
            APPID: appId,
            q: name
          }}).
          success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).
          error(function(data, status, headers, config) {
            deferred.reject('Error retrieving weather forecast');
          });

        return deferred.promise;
      }
    };
  });
