// Add settings
// todo: move to settings service
app.controllers.controller('SettingsController', function ($scope, localStorageService) {
    if (!localStorageService.get('settings')) {
        localStorageService.set('settings', {
            forecast: {
                icon: true,
                temperature: "celsius",
                windSpeedPrimary: "bft",
                windSpeedSecundary: "kph",
                windDirection: true,
                windDirectionReal: true
            },
            locations: {
                showCurrentLocation: true
            },
            general: {
                language: navigator.language
            }
        });
    }
    localStorageService.bind($scope, 'settings');

    $scope.temperatureOptions = [
        {description: 'Uit', value: false},
        {description: 'Celsius', value: "celsius"},
        {description: 'Fahrenheit', value: "fahrenheit"}
    ];

    $scope.windspeedOptions = [
        {description: 'Uit', value: false},
        {description: 'Bft', value: "bft"},
        {description: 'km/u', value: "kph"},
        {description: 'm/s', value: "mps"}
    ];

    $scope.languageOptions = [
        {description: 'Nederlands', value: "nl"},
        {description: 'English', value: "en"}
    ];
});


