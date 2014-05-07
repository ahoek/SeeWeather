angular.module('starter.controllers', [])
    .controller('AppController', function($scope, $ionicSideMenuDelegate) {
      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
    })

    // Location overview
    .controller('LocationsController', function($scope, Locations, $ionicSideMenuDelegate) {

      // Define item buttons (does not work?)
      $scope.itemButtons = [{
          text: 'Verwijderen',
          type: 'button-assertive',
          onTap: function(item) {
            $scope.removeLocation(item);
          }
        }];
      //console.log($scope.itemButtons);

      $scope.locations = Locations.all();

      // Grab the last active, or the first location
      $scope.activeLocation = $scope.locations[Locations.getLastActiveIndex()];

      // Helper function to add location
      var createLocation = function(name) {
        var newLocation = Locations.newLocation(name);
        $scope.locations.push(newLocation);
        Locations.save($scope.locations);
      };

      // Create a new location
      $scope.newLocation = function() {
        var name = prompt('Voer de plaatsnaam in');
        if (name) {
          createLocation(name);
          //$scope.sideMenuController.close();
        }
      };

      $scope.removeLocation = function(index) {
        $scope.locations.splice(index, 1);
        Locations.save($scope.locations);
      }

      // Called to select the given location
      $scope.selectLocation = function(location, index) {
        $scope.activeLocation = location;
        Locations.setLastActiveIndex(index);
        $ionicSideMenuDelegate.toggleLeft(false);
      };
    })

    // Location forecast detail
    .controller('LocationController', function($scope, $stateParams, Locations) {
      $scope.location = Locations.get($stateParams.locationId);

      // Group by day helper function
      var makeGroups = function(weatherList) {
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

      Locations.getWeather($scope.location.name).then(function(weather) {
        $scope.forecastDays = makeGroups(weather.list);
      });

      $scope.refreshWeather = function() {
        Locations.getWeather($scope.location.name).then(function(weather) {
          $scope.forecastDays = makeGroups(weather.list);

          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
      };
    })


