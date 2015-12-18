/**
 * App controller
 */
app.controllers.controller('AppController', function ($scope, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.showSettings = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
});